package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ProjectMemberRole;
import jakarta.validation.constraints.NotNull;

public class UpdateProjectMemberRequest {

    @NotNull
    private ProjectMemberRole projectRole;

    public ProjectMemberRole getProjectRole() {
        return projectRole;
    }

    public void setProjectRole(ProjectMemberRole projectRole) {
        this.projectRole = projectRole;
    }
}