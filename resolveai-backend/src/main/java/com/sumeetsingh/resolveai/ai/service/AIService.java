package com.sumeetsingh.resolveai.ai.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.ai.chat.client.ChatClient;
import org.springframework.stereotype.Service;

import com.sumeetsingh.resolveai.ai.context.IncidentContext;
import com.sumeetsingh.resolveai.ai.context.IncidentContextService;
import com.sumeetsingh.resolveai.ai.document.AIMessage;
import com.sumeetsingh.resolveai.ai.entity.AIConversation;
import com.sumeetsingh.resolveai.ai.repository.AIConversationRepository;
import com.sumeetsingh.resolveai.ai.repository.AIMessageRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIService {

    private final ChatClient.Builder chatClientBuilder;

    private final IncidentContextService incidentContextService;

    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;

    private final UserRepository userRepository;

    public String ask(
            Long conversationId,
            String question,
            String username
    ) {

        // Find the authenticated user.
        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        // Make sure this conversation belongs to this user.
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

        // Get the incident associated with this conversation.
        Long supportRequestId =
                conversation
                        .getSupportRequest()
                        .getSupportRequestId();

        // Build complete project + incident context.
        IncidentContext context =
                incidentContextService.buildContext(
                        supportRequestId
                );

        // Load previous conversation messages.
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
                                Collectors.joining("\n")
                        );

        // Create Spring AI ChatClient.
        ChatClient chatClient =
                chatClientBuilder.build();

        /*
         * Send ONE user prompt containing:
         *
         * Project
         * Incident
         * Logs
         * Attachments
         * Activity history
         * Previous AI conversation
         * Current question
         */
        String response =
                chatClient
                        .prompt()

                        .system("""
                                You are ResolveAI, an AI-powered
                                software incident investigation assistant.

                                You help software engineers investigate
                                application incidents using the provided
                                project and incident context.

                                Rules:

                                1. Use the provided context as the
                                   primary source of truth.

                                2. Do not invent logs, services,
                                   errors, project information,
                                   or incident events.

                                3. Clearly distinguish confirmed facts
                                   from hypotheses.

                                4. Give practical technical
                                   troubleshooting steps.

                                5. If the available information is
                                   insufficient, clearly state what
                                   additional information is required.

                                6. When analyzing logs or attached files,
                                   reference the relevant evidence.

                                7. Do not claim that an issue is resolved
                                   unless the incident context confirms it.
                                """)

                        .user("""
                                PROJECT INFORMATION
                                ===================

                                Project Name:
                                %s

                                Project Code:
                                %s

                                Project Description:
                                %s

                                Project Status:
                                %s


                                TECHNOLOGIES
                                ============

                                %s


                                SERVICES
                                ========

                                %s


                                INCIDENT
                                ========

                                Ticket:
                                %s

                                Title:
                                %s

                                Description:
                                %s

                                Type:
                                %s

                                Severity:
                                %s

                                Status:
                                %s

                                Environment:
                                %s

                                Affected Service:
                                %s

                                Affected Version:
                                %s

                                Error Code:
                                %s


                                EXPECTED BEHAVIOR
                                ==================

                                %s


                                ACTUAL BEHAVIOR
                                ================

                                %s


                                INCIDENT LOGS
                                ==============

                                %s


                                INCIDENT ACTIVITY HISTORY
                                ==========================

                                %s


                                ATTACHED FILES
                                ==============

                                %s


                                PREVIOUS AI CONVERSATION
                                ==========================

                                %s


                                CURRENT USER QUESTION
                                ======================

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

                                context.attachments(),

                                conversationHistory,

                                question
                        ))

                        .call()

                        .content();

        // Save user's question.
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

        // Save AI response.
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

        // Update conversation timestamp.
        conversation.setUpdatedAt(
                LocalDateTime.now()
        );

        conversationRepository.save(
                conversation
        );

        return response;
    }
}