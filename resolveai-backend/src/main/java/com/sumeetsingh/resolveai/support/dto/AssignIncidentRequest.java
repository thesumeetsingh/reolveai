package com.sumeetsingh.resolveai.support.dto;

import jakarta.validation.constraints.NotNull;

public record AssignIncidentRequest(

        @NotNull
        Long userId

) {
}