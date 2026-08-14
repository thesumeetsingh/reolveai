package com.sumeetsingh.resolveai.support.controller;

import com.sumeetsingh.resolveai.support.dto.CreateSupportRequest;
import com.sumeetsingh.resolveai.support.dto.SupportRequestResponse;
import com.sumeetsingh.resolveai.support.service.SupportRequestService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/support")
public class SupportRequestController {

    private final SupportRequestService supportRequestService;

    public SupportRequestController(
            SupportRequestService supportRequestService
    ) {
        this.supportRequestService = supportRequestService;
    }

    @PostMapping
    public ResponseEntity<SupportRequestResponse> createRequest(
            @Valid @RequestBody CreateSupportRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        supportRequestService.createRequest(
                                request,
                                authentication.getName()
                        )
                );
    }
}