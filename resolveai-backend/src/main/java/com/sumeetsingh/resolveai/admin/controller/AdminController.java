package com.sumeetsingh.resolveai.admin.controller;

import java.util.List;

import com.sumeetsingh.resolveai.admin.dto.AdminDashboardResponse;
import com.sumeetsingh.resolveai.incident.dto.UpdateIncidentStatusRequest;
import com.sumeetsingh.resolveai.support.dto.SupportRequestResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.sumeetsingh.resolveai.admin.dto.AdminUserResponse;
import com.sumeetsingh.resolveai.admin.service.AdminService;
import com.sumeetsingh.resolveai.incident.document.IncidentActivity;
import com.sumeetsingh.resolveai.incident.document.IncidentAttachment;
import com.sumeetsingh.resolveai.incident.document.IncidentLog;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;

//import com.sumeetsingh.resolveai.support.dto.AssignIncidentRequest;
import com.sumeetsingh.resolveai.incident.dto.AssignIncidentRequest;
import com.sumeetsingh.resolveai.support.service.SupportRequestService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;
    private final SupportRequestService supportRequestService;


    @GetMapping("/users")
    public ResponseEntity<List<AdminUserResponse>> getUsers() {

        return ResponseEntity.ok(
                adminService.getAllUsers()
        );
    }


    @GetMapping("/support-requests")
    public ResponseEntity<List<SupportRequest>>
    getSupportRequests() {

        return ResponseEntity.ok(
                adminService.getAllSupportRequests()
        );
    }


    @GetMapping("/incidents/{supportRequestId}/logs")
    public ResponseEntity<List<IncidentLog>>
    getIncidentLogs(
            @PathVariable Long supportRequestId
    ) {

        return ResponseEntity.ok(
                adminService.getIncidentLogs(
                        supportRequestId
                )
        );
    }


    @GetMapping("/incidents/{supportRequestId}/activities")
    public ResponseEntity<List<IncidentActivity>>
    getIncidentActivities(
            @PathVariable Long supportRequestId
    ) {

        return ResponseEntity.ok(
                adminService.getIncidentActivities(
                        supportRequestId
                )
        );
    }


    @GetMapping("/incidents/{supportRequestId}/attachments")
    public ResponseEntity<List<IncidentAttachment>>
    getIncidentAttachments(
            @PathVariable Long supportRequestId
    ) {

        return ResponseEntity.ok(
                adminService.getIncidentAttachments(
                        supportRequestId
                )
        );
    }

    @GetMapping("/dashboard")
    public ResponseEntity<AdminDashboardResponse> getDashboard() {

        return ResponseEntity.ok(
                adminService.getDashboard()
        );
    }
    @PutMapping("/incidents/{supportRequestId}/assign")
    public ResponseEntity<SupportRequestResponse> assignIncident(

            @PathVariable Long supportRequestId,

            @Valid @RequestBody
            AssignIncidentRequest request,

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


    @PutMapping("/incidents/{supportRequestId}/status")
    public ResponseEntity<SupportRequestResponse> updateIncidentStatus(

            @PathVariable Long supportRequestId,

            @Valid @RequestBody
            UpdateIncidentStatusRequest request,

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
}