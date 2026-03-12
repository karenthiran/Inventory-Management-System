package com.ims.server.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ims.server.service.EmailService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/email")
@RequiredArgsConstructor
public class EmailController {

    private final EmailService emailService;

    @PostMapping("/send")
    public ResponseEntity<?> sendEmail(
            @RequestParam("to_email") String toEmail,
            @RequestParam("subject") String subject,
            @RequestParam("message") String message,
            @RequestParam(value = "from_email", required = false) String fromEmail,
            @RequestParam(value = "from_username", required = false) String fromUsername,
            @RequestParam(value = "attachment", required = false) MultipartFile attachment) {
        try {
            emailService.sendManualEmail(toEmail, subject, message, fromEmail, fromUsername, attachment);
            return ResponseEntity.ok("Email sent successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to send email: " + e.getMessage());
        }
    }
}