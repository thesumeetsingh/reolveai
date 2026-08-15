package com.sumeetsingh.resolveai.support.controller;

import com.sumeetsingh.resolveai.incident.document.IncidentActivity;
import com.sumeetsingh.resolveai.incident.dto.AddIncidentCommentRequest;
import com.sumeetsingh.resolveai.incident.dto.AssignIncidentRequest;
import com.sumeetsingh.resolveai.incident.dto.UpdateIncidentStatusRequest;
import com.sumeetsingh.resolveai.support.dto.CreateSupportRequest;
import com.sumeetsingh.resolveai.support.dto.SupportRequestResponse;
import com.sumeetsingh.resolveai.support.service.SupportRequestService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    @GetMapping("/my")
    public ResponseEntity<List<SupportRequestResponse>> getMySupportRequests(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                supportRequestService.getMySupportRequests(
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{supportRequestId}/status")
    public ResponseEntity<SupportRequestResponse> updateStatus(
            @PathVariable Long supportRequestId,
            @Valid @RequestBody UpdateIncidentStatusRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                supportRequestService.updateIncidentStatus(
                        supportRequestId,
                        request,
                        authentication.getName()
                )
        );
    }

    @PutMapping("/{supportRequestId}/assign")
    public ResponseEntity<SupportRequestResponse> assignIncident(
            @PathVariable Long supportRequestId,
            @Valid @RequestBody AssignIncidentRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                supportRequestService.assignIncident(
                        supportRequestId,
                        request,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{supportRequestId}/comments")
    public ResponseEntity<IncidentActivity> addComment(
            @PathVariable Long supportRequestId,
            @Valid @RequestBody AddIncidentCommentRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        supportRequestService.addComment(
                                supportRequestId,
                                request,
                                authentication.getName()
                        )
                );
    }

    @GetMapping("/{supportRequestId}/activities")
    public ResponseEntity<List<IncidentActivity>> getActivities(
            @PathVariable Long supportRequestId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                supportRequestService.getActivities(
                        supportRequestId,
                        authentication.getName()
                )
        );
    }
}