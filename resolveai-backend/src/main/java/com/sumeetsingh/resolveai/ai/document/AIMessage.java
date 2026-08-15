package com.sumeetsingh.resolveai.ai.document;

import java.time.LocalDateTime;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "ai_messages")
public class AIMessage {

    @Id
    private String id;

    private Long conversationId;
    private Long supportRequestId;
    private Long userId;

    private String role;
    private String content;

    private LocalDateTime createdAt;
}