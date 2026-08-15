package com.sumeetsingh.resolveai.user.controller;

import com.sumeetsingh.resolveai.user.dto.EmployeeSearchResponse;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/me")
    public Map<String, Object> getCurrentUser(
            Authentication authentication
    ) {

        return Map.of(
                "username", authentication.getName(),
                "authorities", authentication.getAuthorities()
        );
    }

    @GetMapping("/employees")
    public List<EmployeeSearchResponse> searchEmployees(
            @RequestParam(
                    required = false,
                    defaultValue = ""
            )
            String search
    ) {

        return userRepository
                .searchActiveEmployees(search.trim())
                .stream()
                .map(this::toEmployeeSearchResponse)
                .toList();
    }

    private EmployeeSearchResponse toEmployeeSearchResponse(
            User user
    ) {

        return new EmployeeSearchResponse(
                user.getUserId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus()
        );
    }
}