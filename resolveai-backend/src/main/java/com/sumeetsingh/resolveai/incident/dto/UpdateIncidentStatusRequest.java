package com.sumeetsingh.resolveai.incident.dto;

import com.sumeetsingh.resolveai.support.entity.IncidentStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateIncidentStatusRequest {

    @NotNull
    private IncidentStatus status;

    private String message;

    private String resolutionSummary;

    public UpdateIncidentStatusRequest() {
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public void setStatus(IncidentStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }
}