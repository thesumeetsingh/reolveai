package com.sumeetsingh.resolveai.incident.document;

import java.time.LocalDateTime;
import java.util.List;

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
@Document(collection = "incident_logs")
public class IncidentLog {

    @Id
    private String id;

    private Long supportRequestId;
    private Long projectId;
    private Long uploadedBy;

    private String source;
    private String logType;
    private String fileName;

    private String content;

    private String environment;
    private String serviceName;

    private LocalDateTime uploadedAt;

    private List<String> detectedErrors;
    private String aiAnalysis;
}