package com.sumeetsingh.resolveai.ai.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sumeetsingh.resolveai.ai.entity.AIConversation;

public interface AIConversationRepository
        extends JpaRepository<AIConversation, Long> {

    List<AIConversation> findByUserUserIdOrderByUpdatedAtDesc(
            Long userId
    );

    List<AIConversation> findBySupportRequestSupportRequestIdAndUserUserId(
            Long supportRequestId,
            Long userId
    );

    Optional<AIConversation> findByConversationIdAndUserUserId(
            Long conversationId,
            Long userId
    );
}