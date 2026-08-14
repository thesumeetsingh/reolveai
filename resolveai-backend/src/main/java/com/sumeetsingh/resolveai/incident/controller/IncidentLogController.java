package com.sumeetsingh.resolveai.incident.controller;

import java.util.List;

import com.sumeetsingh.resolveai.incident.dto.CreateIncidentLogRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sumeetsingh.resolveai.incident.document.IncidentLog;
import com.sumeetsingh.resolveai.incident.service.IncidentLogService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentLogController {

    private final IncidentLogService incidentLogService;


    @GetMapping("/support/{supportRequestId}")
    public ResponseEntity<List<IncidentLog>> getBySupportRequest(
            @PathVariable Long supportRequestId) {

        return ResponseEntity.ok(
                incidentLogService.getLogsBySupportRequest(supportRequestId)
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<IncidentLog>> getByProject(
            @PathVariable Long projectId) {

        return ResponseEntity.ok(
                incidentLogService.getLogsByProject(projectId)
        );
    }


    @PostMapping("/logs")
    public ResponseEntity<IncidentLog> createLog(
            @Valid @RequestBody CreateIncidentLogRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                incidentLogService.saveLog(
                        request,
                        authentication.getName()
                )
        );
    }
}