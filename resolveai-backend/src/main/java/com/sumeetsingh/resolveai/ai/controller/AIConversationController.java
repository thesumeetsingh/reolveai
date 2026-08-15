package com.sumeetsingh.resolveai.ai.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sumeetsingh.resolveai.ai.document.AIMessage;
import com.sumeetsingh.resolveai.ai.dto.CreateConversationRequest;
import com.sumeetsingh.resolveai.ai.entity.AIConversation;
import com.sumeetsingh.resolveai.ai.service.AIConversationService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai/conversations")
@RequiredArgsConstructor
public class AIConversationController {

    private final AIConversationService conversationService;

    @PostMapping
    public ResponseEntity<AIConversation> createConversation(
            @Valid @RequestBody CreateConversationRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        conversationService.createConversation(
                                request,
                                authentication.getName()
                        )
                );
    }

    @GetMapping("/{conversationId}/messages")
    public ResponseEntity<List<AIMessage>> getMessages(
            @PathVariable Long conversationId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                conversationService.getMessages(
                        conversationId,
                        authentication.getName()
                )
        );
    }
}