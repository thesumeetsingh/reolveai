package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ProjectMemberRole;
import jakarta.validation.constraints.NotNull;

public class AddProjectMemberRequest {

    @NotNull
    private Long userId;

    @NotNull
    private ProjectMemberRole projectRole;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public ProjectMemberRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectMemberRole projectRole) {
        this.projectRole = projectRole;
    }
}