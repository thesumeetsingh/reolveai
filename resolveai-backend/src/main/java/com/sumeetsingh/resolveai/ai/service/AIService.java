package com.sumeetsingh.resolveai.ai.service;

import com.sumeetsingh.resolveai.ai.document.AIMessage;
import com.sumeetsingh.resolveai.ai.entity.AIConversation;
import com.sumeetsingh.resolveai.ai.repository.AIConversationRepository;
import com.sumeetsingh.resolveai.ai.repository.AIMessageRepository;
import com.sumeetsingh.resolveai.user.repository.UserRepository;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.sumeetsingh.resolveai.ai.context.IncidentContext;
import com.sumeetsingh.resolveai.ai.context.IncidentContextService;
import java.time.LocalDateTime;
import java.util.List;

import com.sumeetsingh.resolveai.user.entity.User;


import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient.Builder chatClientBuilder;
    private final IncidentContextService incidentContextService;
    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;
    private final UserRepository userRepository;

    public String analyzeIncident(
            Long supportRequestId,
            String question
    ) {

        IncidentContext context =
                incidentContextService.buildContext(
                        supportRequestId
                );

        ChatClient chatClient =
                chatClientBuilder.build();

        return chatClient
                .prompt()
                .system("""
                        You are ResolveAI, an AI-powered
                        software incident investigation assistant.

                        You help software engineers diagnose
                        application incidents using the provided
                        project and incident context.

                        Rules:
                        - Use the provided context as the primary source.
                        - Do not invent logs, services, errors or events.
                        - Clearly distinguish facts from hypotheses.
                        - Give technically practical troubleshooting steps.
                        - If the available information is insufficient,
                          explicitly say what information is missing.
                        """)
                .user("""
                        Analyze the following software incident.

                        PROJECT:
                        Project Name: %s
                        Project Code: %s
                        Project Description: %s
                        Project Status: %s

                        TECHNOLOGIES:
                        %s

                        SERVICES:
                        %s

                        INCIDENT:
                        Ticket: %s
                        Title: %s
                        Description: %s
                        Type: %s
                        Severity: %s
                        Status: %s
                        Environment: %s
                        Affected Service: %s
                        Affected Version: %s
                        Error Code: %s

                        EXPECTED BEHAVIOR:
                        %s

                        ACTUAL BEHAVIOR:
                        %s

                        LOGS:
                        %s

                        INCIDENT HISTORY:
                        %s

                        USER QUESTION:
                        %s
                        """.formatted(
                        context.projectName(),
                        context.projectCode(),
                        context.projectDescription(),
                        context.projectStatus(),
                        context.technologies(),
                        context.services(),
                        context.ticketNumber(),
                        context.incidentTitle(),
                        context.incidentDescription(),
                        context.incidentType(),
                        context.severity(),
                        context.status(),
                        context.environment(),
                        context.affectedService(),
                        context.affectedVersion(),
                        context.errorCode(),
                        context.expectedBehavior(),
                        context.actualBehavior(),
                        context.logs(),
                        context.activities(),
                        question
                ))
                .call()
                .content();
    }
    public String ask(
            Long conversationId,
            String question,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        AIConversation conversation =
                conversationRepository
                        .findByConversationIdAndUserUserId(
                                conversationId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Conversation not found"
                                )
                        );

        Long supportRequestId =
                conversation
                        .getSupportRequest()
                        .getSupportRequestId();

        IncidentContext context =
                incidentContextService.buildContext(
                        supportRequestId
                );

        List<AIMessage> history =
                messageRepository
                        .findByConversationIdOrderByCreatedAtAsc(
                                conversationId
                        );

        String conversationHistory =
                history.stream()
                        .map(message ->
                                message.getRole()
                                        + ": "
                                        + message.getContent()
                        )
                        .collect(
                                java.util.stream.Collectors.joining(
                                        "\n"
                                )
                        );

        ChatClient chatClient =
                chatClientBuilder.build();

        String response =
                chatClient
                        .prompt()
                        .system("""
                            You are ResolveAI, an AI-powered
                            software incident investigation assistant.

                            Use the incident context and conversation
                            history to help the engineer.

                            Do not invent facts.
                            Clearly distinguish facts from hypotheses.
                            Give practical technical troubleshooting steps.
                            """)
                        .user("""
                            INCIDENT CONTEXT:

                            Project:
                            %s

                            Technologies:
                            %s

                            Services:
                            %s

                            Incident:
                            %s

                            Description:
                            %s

                            Severity:
                            %s

                            Status:
                            %s

                            Environment:
                            %s

                            Affected Service:
                            %s

                            Logs:
                            %s

                            Incident History:
                            %s

                            PREVIOUS AI CONVERSATION:
                            %s

                            CURRENT QUESTION:
                            %s
                            """.formatted(
                                context.projectName(),
                                context.technologies(),
                                context.services(),
                                context.incidentTitle(),
                                context.incidentDescription(),
                                context.severity(),
                                context.status(),
                                context.environment(),
                                context.affectedService(),
                                context.logs(),
                                context.activities(),
                                conversationHistory,
                                question
                        ))
                        .call()
                        .content();

        messageRepository.save(
                AIMessage.builder()
                        .conversationId(conversationId)
                        .supportRequestId(supportRequestId)
                        .userId(user.getUserId())
                        .role("USER")
                        .content(question)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        messageRepository.save(
                AIMessage.builder()
                        .conversationId(conversationId)
                        .supportRequestId(supportRequestId)
                        .userId(user.getUserId())
                        .role("ASSISTANT")
                        .content(response)
                        .createdAt(LocalDateTime.now())
                        .build()
        );

        conversation.setUpdatedAt(LocalDateTime.now());

        conversationRepository.save(conversation);

        return response;
    }
}