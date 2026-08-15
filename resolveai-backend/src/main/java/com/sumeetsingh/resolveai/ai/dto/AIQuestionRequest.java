package com.sumeetsingh.resolveai.ai.dto;

import jakarta.validation.constraints.NotBlank;

public record AIQuestionRequest(
        @NotBlank String question
) {
}