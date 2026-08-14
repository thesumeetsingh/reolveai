package com.sumeetsingh.resolveai.support.dto;

import com.sumeetsingh.resolveai.support.entity.*;

import java.time.LocalDateTime;

public class SupportRequestResponse {

    private Long supportRequestId;
    private String ticketNumber;

    private Long projectId;
    private String projectCode;
    private String projectName;

    private Long reportedById;
    private String reportedByUsername;

    private Long assignedToId;
    private String assignedToUsername;

    private String title;
    private String description;

    private IncidentType incidentType;
    private IncidentSeverity severity;
    private IncidentStatus status;

    private String environment;
    private String affectedService;
    private String affectedVersion;
    private String errorCode;

    private String expectedBehavior;
    private String actualBehavior;
    private String resolutionSummary;

    private LocalDateTime createdAt;

    public Long getSupportRequestId() {
        return supportRequestId;
    }

    public String getTicketNumber() {
        return ticketNumber;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public String getProjectName() {
        return projectName;
    }

    public Long getReportedById() {
        return reportedById;
    }

    public String getReportedByUsername() {
        return reportedByUsername;
    }

    public Long getAssignedToId() {
        return assignedToId;
    }

    public String getAssignedToUsername() {
        return assignedToUsername;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public IncidentStatus getStatus() {
        return status;
    }

    public String getEnvironment() {
        return environment;
    }

    public String getAffectedService() {
        return affectedService;
    }

    public String getAffectedVersion() {
        return affectedVersion;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public String getExpectedBehavior() {
        return expectedBehavior;
    }

    public String getActualBehavior() {
        return actualBehavior;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public LocalDateTime getResolvedAt() {
        return resolvedAt;
    }

    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;

    public SupportRequestResponse(Long supportRequestId, String ticketNumber, Long projectId, String projectCode, String projectName, Long reportedById, String reportedByUsername, Long assignedToId, String assignedToUsername, String title, String description, IncidentType incidentType, IncidentSeverity severity, IncidentStatus status, String environment, String affectedService, String affectedVersion, String errorCode, String expectedBehavior, String actualBehavior, String resolutionSummary, LocalDateTime createdAt, LocalDateTime updatedAt, LocalDateTime resolvedAt) {
        this.supportRequestId = supportRequestId;
        this.ticketNumber = ticketNumber;
        this.projectId = projectId;
        this.projectCode = projectCode;
        this.projectName = projectName;
        this.reportedById = reportedById;
        this.reportedByUsername = reportedByUsername;
        this.assignedToId = assignedToId;
        this.assignedToUsername = assignedToUsername;
        this.title = title;
        this.description = description;
        this.incidentType = incidentType;
        this.severity = severity;
        this.status = status;
        this.environment = environment;
        this.affectedService = affectedService;
        this.affectedVersion = affectedVersion;
        this.errorCode = errorCode;
        this.expectedBehavior = expectedBehavior;
        this.actualBehavior = actualBehavior;
        this.resolutionSummary = resolutionSummary;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.resolvedAt = resolvedAt;
    }
}