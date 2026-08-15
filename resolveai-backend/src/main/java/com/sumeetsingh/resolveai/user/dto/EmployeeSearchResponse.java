package com.sumeetsingh.resolveai.user.dto;

public record EmployeeSearchResponse(
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String status
) {
}