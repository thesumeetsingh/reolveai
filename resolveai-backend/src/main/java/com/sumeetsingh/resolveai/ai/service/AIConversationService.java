package com.sumeetsingh.resolveai.ai.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumeetsingh.resolveai.ai.document.AIMessage;
import com.sumeetsingh.resolveai.ai.dto.CreateConversationRequest;
import com.sumeetsingh.resolveai.ai.entity.AIConversation;
import com.sumeetsingh.resolveai.ai.repository.AIConversationRepository;
import com.sumeetsingh.resolveai.ai.repository.AIMessageRepository;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AIConversationService {

    private final AIConversationRepository conversationRepository;
    private final AIMessageRepository messageRepository;

    private final SupportRequestRepository supportRequestRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    @Transactional
    public AIConversation createConversation(
            CreateConversationRequest request,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        SupportRequest incident =
                supportRequestRepository.findById(
                        request.supportRequestId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support request not found"
                        )
                );

        Long projectId =
                incident.getProject().getProjectId();

        projectMemberRepository
                .findByProjectProjectIdAndUserUserId(
                        projectId,
                        user.getUserId()
                )
                .filter(member ->
                        member.getStatus()
                                == ProjectMemberStatus.ACTIVE
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "You do not have access to this project"
                        )
                );

        AIConversation conversation =
                new AIConversation();

        conversation.setSupportRequest(incident);
        conversation.setProject(incident.getProject());
        conversation.setUser(user);
        conversation.setTitle(request.title());

        return conversationRepository.save(
                conversation
        );
    }

    @Transactional(readOnly = true)
    public List<AIMessage> getMessages(
            Long conversationId,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

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

        return messageRepository
                .findByConversationIdOrderByCreatedAtAsc(
                        conversationId
                );
    }
}