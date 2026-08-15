package com.sumeetsingh.resolveai.incident.document;

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
@Document(collection = "incident_attachments")
public class IncidentAttachment {

    @Id
    private String id;

    private Long supportRequestId;
    private Long projectId;
    private Long uploadedBy;

    private String fileName;
    private String contentType;
    private Long fileSize;

    private String gridFsFileId;

    private LocalDateTime uploadedAt;
    private String extractedText;
}