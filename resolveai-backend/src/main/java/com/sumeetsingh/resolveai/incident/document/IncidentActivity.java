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
@Document(collection = "incident_activities")
public class IncidentActivity {

    @Id
    private String id;

    private Long supportRequestId;
    private Long projectId;

    private Long actorId;
    private String actorUsername;

    private String activityType;

    private String message;

    private String oldStatus;
    private String newStatus;

    private Long oldAssigneeId;
    private Long newAssigneeId;

    private LocalDateTime createdAt;
}