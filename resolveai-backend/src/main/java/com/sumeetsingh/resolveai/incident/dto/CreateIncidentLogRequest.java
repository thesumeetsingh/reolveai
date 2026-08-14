package com.sumeetsingh.resolveai.incident.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CreateIncidentLogRequest {

    @NotNull
    private Long supportRequestId;

    @NotNull
    private Long projectId;

    @NotBlank
    private String source;

    @NotBlank
    private String logType;

    private String fileName;

    @NotBlank
    private String content;

    private String environment;

    private String serviceName;

    public Long getSupportRequestId() {
        return supportRequestId;
    }

    public void setSupportRequestId(Long supportRequestId) {
        this.supportRequestId = supportRequestId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getLogType() {
        return logType;
    }

    public void setLogType(String logType) {
        this.logType = logType;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getEnvironment() {
        return environment;
    }

    public void setEnvironment(String environment) {
        this.environment = environment;
    }

    public String getServiceName() {
        return serviceName;
    }

    public void setServiceName(String serviceName) {
        this.serviceName = serviceName;
    }
}