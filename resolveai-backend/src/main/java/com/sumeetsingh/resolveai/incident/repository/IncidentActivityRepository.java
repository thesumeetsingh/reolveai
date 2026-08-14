package com.sumeetsingh.resolveai.incident.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sumeetsingh.resolveai.incident.document.IncidentActivity;

public interface IncidentActivityRepository
        extends MongoRepository<IncidentActivity, String> {

    List<IncidentActivity> findBySupportRequestIdOrderByCreatedAtAsc(
            Long supportRequestId
    );
}