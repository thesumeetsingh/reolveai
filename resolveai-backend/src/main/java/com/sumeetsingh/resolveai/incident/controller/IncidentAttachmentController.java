package com.sumeetsingh.resolveai.incident.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.sumeetsingh.resolveai.incident.document.IncidentAttachment;
import com.sumeetsingh.resolveai.incident.service.IncidentAttachmentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/incidents")
@RequiredArgsConstructor
public class IncidentAttachmentController {

    private final IncidentAttachmentService attachmentService;

    @PostMapping(
            value = "/{supportRequestId}/attachments",
            consumes = "multipart/form-data"
    )
    public ResponseEntity<IncidentAttachment> uploadFile(
            @PathVariable Long supportRequestId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication
    ) throws IOException {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        attachmentService.uploadFile(
                                supportRequestId,
                                file,
                                authentication.getName()
                        )
                );
    }

    @GetMapping("/{supportRequestId}/attachments")
    public ResponseEntity<List<IncidentAttachment>> getAttachments(
            @PathVariable Long supportRequestId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                attachmentService.getAttachments(
                        supportRequestId,
                        authentication.getName()
                )
        );
    }
}