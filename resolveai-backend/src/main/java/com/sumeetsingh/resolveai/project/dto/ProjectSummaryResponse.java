package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ProjectStatus;

public class ProjectSummaryResponse {

    private Long projectId;
    private String projectCode;
    private String projectName;
    private ProjectStatus status;

    public ProjectSummaryResponse(
            Long projectId,
            String projectCode,
            String projectName,
            ProjectStatus status
    ) {
        this.projectId = projectId;
        this.projectCode = projectCode;
        this.projectName = projectName;
        this.status = status;
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

    public ProjectStatus getStatus() {
        return status;
    }
}