package com.sumeetsingh.resolveai.support.dto;

import com.sumeetsingh.resolveai.support.entity.IncidentSeverity;
import com.sumeetsingh.resolveai.support.entity.IncidentType;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateSupportRequest {

    @NotNull
    private Long projectId;

    @NotBlank
    @Size(max = 250)
    private String title;

    @Size(max = 5000)
    private String description;

    @NotNull
    private IncidentType incidentType;

    @NotNull
    private IncidentSeverity severity;

    @Size(max = 100)
    private String environment;

    @Size(max = 100)
    private String affectedService;

    @Size(max = 100)
    private String affectedVersion;

    @Size(max = 1000)
    private String errorCode;

    @Size(max = 5000)
    private String expectedBehavior;

    @Size(max = 5000)
    private String actualBehavior;

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public IncidentType getIncidentType() {
        return incidentType;
    }

    public void setIncidentType(IncidentType incidentType) {
        this.incidentType = incidentType;
    }

    public IncidentSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(IncidentSeverity severity) {
        this.severity = severity;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getAffectedService() {
        return affectedService;
    }

    public void setAffectedService(String affectedService) {
        this.affectedService = affectedService;
    }

    public String getAffectedVersion() {
        return affectedVersion;
    }

    public void setAffectedVersion(String affectedVersion) {
        this.affectedVersion = affectedVersion;
    }

    public String getErrorCode() {
        return errorCode;
    }

    public void setErrorCode(String errorCode) {
        this.errorCode = errorCode;
    }

    public String getExpectedBehavior() {
        return expectedBehavior;
    }

    public void setExpectedBehavior(String expectedBehavior) {
        this.expectedBehavior = expectedBehavior;
    }

    public String getActualBehavior() {
        return actualBehavior;
    }

    public void setActualBehavior(String actualBehavior) {
        this.actualBehavior = actualBehavior;
    }
}