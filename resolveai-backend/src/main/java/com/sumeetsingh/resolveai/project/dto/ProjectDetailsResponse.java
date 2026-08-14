package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ProjectStatus;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectDetailsResponse {

    private Long projectId;
    private String projectCode;
    private String projectName;
    private String description;
    private Long ownerId;
    private String ownerUsername;
    private ProjectStatus status;
    private String repositoryUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<ProjectMemberResponse> members;

    public ProjectDetailsResponse(
            Long projectId,
            String projectCode,
            String projectName,
            String description,
            Long ownerId,
            String ownerUsername,
            ProjectStatus status,
            String repositoryUrl,
            LocalDateTime createdAt,
            LocalDateTime updatedAt,
            List<ProjectMemberResponse> members
    ) {
        this.projectId = projectId;
        this.projectCode = projectCode;
        this.projectName = projectName;
        this.description = description;
        this.ownerId = ownerId;
        this.ownerUsername = ownerUsername;
        this.status = status;
        this.repositoryUrl = repositoryUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.members = members;
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

    public String getDescription() {
        return description;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public String getOwnerUsername() {
        return ownerUsername;
    }

    public ProjectStatus getStatus() {
        return status;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public List<ProjectMemberResponse> getMembers() {
        return members;
    }
}