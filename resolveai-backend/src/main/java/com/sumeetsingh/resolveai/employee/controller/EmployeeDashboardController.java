package com.sumeetsingh.resolveai.employee.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sumeetsingh.resolveai.employee.dto.EmployeeDashboardResponse;
import com.sumeetsingh.resolveai.employee.service.EmployeeDashboardService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeDashboardController {

    private final EmployeeDashboardService dashboardService;

    @GetMapping("/dashboard")
    public ResponseEntity<EmployeeDashboardResponse> getDashboard(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                dashboardService.getDashboard(
                        authentication.getName()
                )
        );
    }
}