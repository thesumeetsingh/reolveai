package com.sumeetsingh.resolveai.incident.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sumeetsingh.resolveai.incident.document.IncidentAttachment;

public interface IncidentAttachmentRepository
        extends MongoRepository<IncidentAttachment, String> {

    List<IncidentAttachment> findBySupportRequestId(
            Long supportRequestId
    );

    List<IncidentAttachment> findByProjectId(
            Long projectId
    );
}