package com.sumeetsingh.resolveai.incident.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AddIncidentCommentRequest {

    @NotBlank
    @Size(max = 5000)
    private String message;

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}