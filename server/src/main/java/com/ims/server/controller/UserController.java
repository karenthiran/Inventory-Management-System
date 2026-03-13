package com.ims.server.controller;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ims.server.dto.LoginRequest;
import com.ims.server.model.User;
import com.ims.server.repository.UserRepository;
import com.ims.server.service.EmailService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private final Map<String, OTPData> otpStorage = new ConcurrentHashMap<>();

    private static class OTPData {
        String code;
        long expiryTime;

        OTPData(String code) {
            this.code = code;
            this.expiryTime = System.currentTimeMillis() + (5 * 60 * 1000);
        }

        boolean isExpired() {
            return System.currentTimeMillis() > expiryTime;
        }
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userRepository.existsById(user.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        // ✅ Generate a secure random temp password instead of using what admin typed
        String tempPassword = generateTempPassword();

        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setMustChangePassword(true); // ✅ force change on first login
        User savedUser = userRepository.save(user);

        // ✅ Send welcome email with temp password
        try {
            emailService.sendWelcomeEmail(
                    savedUser.getEmail(),
                    savedUser.getUsername(),
                    savedUser.getRole(),
                    tempPassword // ✅ temp only — user must change immediately
            );
        } catch (Exception e) {
            System.err.println("Welcome email failed: " + e.getMessage());
        }

        return ResponseEntity.ok(savedUser);
    }

    // ✅ Generates a secure 10-char random password
    private String generateTempPassword() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$!";
        SecureRandom random = new SecureRandom();
        StringBuilder sb = new StringBuilder(10);
        for (int i = 0; i < 10; i++) {
            sb.append(chars.charAt(random.nextInt(chars.length())));
        }
        return sb.toString();
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        return userRepository.findByEmail(loginRequest.getEmail())
                .map(user -> {
                    if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
                        return ResponseEntity.ok(user);
                    } else {
                        return ResponseEntity.status(401).body("Invalid password.");
                    }
                })
                .orElse(ResponseEntity.status(404).body("Email not found."));
    }

    @GetMapping("/profile/{username}")
    public ResponseEntity<?> getUserByUsername(@PathVariable("username") String username) {
        return userRepository.findByUsername(username)
                .map(user -> {
                    user.setPassword(null);
                    return ResponseEntity.ok((Object) user);
                })
                .orElse(ResponseEntity.status(404).body("User profile not found"));
    }

    // ✅ Simple delete — no foreign key cascade needed anymore
    @DeleteMapping("/{username}")
    public ResponseEntity<?> deleteUser(
            @PathVariable String username,
            @RequestHeader("X-Username") String loggedInUsername) { // ✅ read from request header

        // ✅ Prevent self-deletion
        if (username.equals(loggedInUsername)) {
            return ResponseEntity.badRequest().body("You cannot delete your own account.");
        }

        return userRepository.findByUsername(username)
                .map(user -> {
                    userRepository.delete(user);
                    return ResponseEntity.ok("User deleted successfully");
                })
                .orElse(ResponseEntity.status(404).body("User not found"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> requestOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (!userRepository.existsByEmail(email)) {
            return ResponseEntity.status(404).body("Email not registered in IMS.");
        }
        String otp = emailService.generateOTP();
        otpStorage.put(email, new OTPData(otp));
        try {
            emailService.sendOtpEmail(email, otp);
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email. Check SMTP config.");
        }
    }

    @PostMapping("/verify-otp-reset")
    public ResponseEntity<?> verifyAndReset(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String otp = request.get("otp");
        String newPassword = request.get("newPassword");

        OTPData storedData = otpStorage.get(email);

        if (storedData == null || !storedData.code.equals(otp)) {
            return ResponseEntity.status(400).body("Invalid OTP code.");
        }
        if (storedData.isExpired()) {
            otpStorage.remove(email);
            return ResponseEntity.status(400).body("OTP has expired. Please request a new one.");
        }

        return userRepository.findByEmail(email).map(user -> {
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            otpStorage.remove(email);
            return ResponseEntity.ok("Password reset successful.");
        }).orElse(ResponseEntity.status(404).body("User not found."));
    }
}