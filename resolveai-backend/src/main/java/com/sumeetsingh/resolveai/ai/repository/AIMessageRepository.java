package com.sumeetsingh.resolveai.ai.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sumeetsingh.resolveai.ai.document.AIMessage;

public interface AIMessageRepository
        extends MongoRepository<AIMessage, String> {

    List<AIMessage> findByConversationIdOrderByCreatedAtAsc(
            Long conversationId
    );
}