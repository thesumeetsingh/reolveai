package com.sumeetsingh.resolveai.ai.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sumeetsingh.resolveai.ai.dto.AIQuestionRequest;
import com.sumeetsingh.resolveai.ai.service.AIService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final AIService aiService;

    @PostMapping("/incidents/{supportRequestId}/ask")
    public ResponseEntity<String> askAboutIncident(
            @PathVariable Long supportRequestId,
            @Valid @RequestBody AIQuestionRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                aiService.analyzeIncident(
                        supportRequestId,
                        request.question()
                )
        );
    }
    @PostMapping("/conversations/{conversationId}/ask")
    public ResponseEntity<String> ask(
            @PathVariable Long conversationId,
            @Valid @RequestBody AIQuestionRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                aiService.ask(
                        conversationId,
                        request.question(),
                        authentication.getName()
                )
        );
    }
}