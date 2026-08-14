package com.sumeetsingh.resolveai.user.dto;

import java.util.Set;

public class LoginResponse {

    private Long userId;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private Set<String> roles;
    private String token;

    public LoginResponse(
            Long userId,
            String username,
            String email,
            String firstName,
            String lastName,
            Set<String> roles,
            String token
    ) {
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.token = token;
    }
    public String getToken() {
        return token;
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

    public Set<String> getRoles() {
        return roles;
    }
}