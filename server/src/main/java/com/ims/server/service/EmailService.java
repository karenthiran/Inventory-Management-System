package com.ims.server.service;

import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ims.server.dto.IssueNotificationRequest;

import jakarta.mail.internet.MimeMessage;

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

    public void sendIssueNotification(IssueNotificationRequest req) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(req.getToEmail());
        message.setSubject("IMS — Item Issued to You");
        message.setText(
                "Dear " + req.getUsername() + ",\n\n" +
                        "The following item has been issued to you:\n\n" +
                        "  Item Name   : " + req.getItemName() + "\n" +
                        "  Item Code(s): " + req.getItemCodes() + "\n" +
                        "  Issued By   : " + req.getIssuedBy() + "\n" +
                        "  Issue Date  : " + req.getIssueDate() + "\n" +
                        "  Return By   : " + req.getExpectedReturnDate() + "\n" +
                        "  Location    : " + req.getLocation() + "\n\n" +
                        "Please return the item by the due date.\n\n" +
                        "Regards,\nIMS — Deparment of Computer Enginnering \nFaculty of Engineering");
        mailSender.send(message);
    }

    public void sendReturnNotification(String toEmail, String username, String itemName,
            String itemCodes, String returnDate, String conditionStatus) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("IMS — Item Return Confirmed");
        message.setText(
                "Dear " + username + ",\n\n" +
                        "Your item return has been successfully processed:\n\n" +
                        "  Item Name   : " + itemName + "\n" +
                        "  Item Code(s): " + itemCodes + "\n" +
                        "  Return Date : " + returnDate + "\n" +
                        "  Condition   : " + conditionStatus + "\n\n" +
                        "Thank you for returning the item on time.\n\n" +
                        "Regards,\nIMS — Deparment of Computer Enginnering \nFaculty of Engineering ");
        mailSender.send(message);
    }

    public void sendManualEmail(String toEmail, String subject, String message,
            String fromEmail, String fromUsername,
            MultipartFile attachment) throws Exception {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);

        helper.setTo(toEmail);
        helper.setSubject(subject);
        helper.setText(message);

        // ✅ Set reply-to as the logged-in user's email
        if (fromEmail != null && !fromEmail.isBlank()) {
            helper.setReplyTo(fromEmail, fromUsername != null ? fromUsername : fromEmail);
        }

        // ✅ Add sender name in the body footer
        String fullMessage = message + "\n\n---\nSent by: " + fromUsername + " (" + fromEmail + ")";
        helper.setText(fullMessage);

        if (attachment != null && !attachment.isEmpty()) {
            helper.addAttachment(attachment.getOriginalFilename(), attachment);
        }

        mailSender.send(mimeMessage);
    }

    public void sendWelcomeEmail(String toEmail, String username, String role, String tempPassword) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Welcome to IMS — Your Account Details");
        message.setText(
                "Dear " + username + ",\n\n" +
                        "Your IMS account has been created successfully.\n\n" +
                        "Your Login Details:\n" +
                        "  Username : " + username + "\n" +
                        "  Email    : " + toEmail + "\n" +
                        "  Role     : " + role + "\n" +
                        "  Password : " + tempPassword + "\n\n" +
                        "⚠️  IMPORTANT: Please change your password immediately after your first login.\n\n" +
                        "Login here: https://inventrax.sytes.net\n\n" +
                        "Regards,\nIMS — Faculty of Engineering, University of Jaffna");
        mailSender.send(message);
    }

}
