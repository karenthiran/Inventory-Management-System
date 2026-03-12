package com.ims.server.dto;

import lombok.Data;

@Data
public class IssueNotificationRequest {
    private String toEmail;
    private String username;
    private String itemName;
    private String itemCodes;
    private String issuedBy;
    private String issueDate;
    private String expectedReturnDate;
    private String location;
}