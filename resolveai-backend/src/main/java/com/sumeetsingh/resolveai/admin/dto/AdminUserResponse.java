package com.sumeetsingh.resolveai.admin.dto;

public record AdminUserResponse(
        Long userId,
        String username,
        String email,
        String firstName,
        String lastName,
        String mobile,
        String status
) {
}