package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ProjectMemberRole;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;

public class ProjectMemberResponse {

    private Long userId;
    private String username;
    private String firstName;
    private String lastName;
    private ProjectMemberRole projectRole;
    private ProjectMemberStatus status;

    public ProjectMemberResponse(
            Long userId,
            String username,
            String firstName,
            String lastName,
            ProjectMemberRole projectRole,
            ProjectMemberStatus status
    ) {
        this.userId = userId;
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.projectRole = projectRole;
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public ProjectMemberRole getProjectRole() {
        return projectRole;
    }

    public ProjectMemberStatus getStatus() {
        return status;
    }
}