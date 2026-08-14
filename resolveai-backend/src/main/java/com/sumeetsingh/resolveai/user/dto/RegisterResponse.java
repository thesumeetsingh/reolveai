package com.sumeetsingh.resolveai.user.dto;

public class RegisterResponse {

    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private String status;

    public RegisterResponse(
            Long userId,
            String username,
            String email,
            String firstName,
            String lastName,
            String status
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUsername() {
        return username;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getStatus() {
        return status;
    }
}