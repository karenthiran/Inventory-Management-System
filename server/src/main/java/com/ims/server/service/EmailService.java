package com.ims.server.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service // This tells Spring to manage this class
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("IMS Password Reset - Your OTP");
        message.setText("Hello,\n\nYour 6-digit OTP for resetting your password is: " + otp +
                "\n\nThis code is valid for 5 minutes. If you did not request this, please ignore this email.");

        mailSender.send(message);
    }

    public String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }
}
