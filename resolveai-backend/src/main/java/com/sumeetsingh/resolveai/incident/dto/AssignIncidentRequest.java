package com.sumeetsingh.resolveai.incident.dto;

import jakarta.validation.constraints.NotNull;

public class AssignIncidentRequest {

    @NotNull
    private Long userId;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}