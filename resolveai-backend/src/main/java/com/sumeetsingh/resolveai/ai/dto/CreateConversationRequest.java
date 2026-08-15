package com.sumeetsingh.resolveai.ai.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateConversationRequest(

        @NotNull
        Long supportRequestId,

        @NotBlank
        String title

) {
}