package com.sumeetsingh.resolveai.incident.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.sumeetsingh.resolveai.incident.document.IncidentLog;

public interface IncidentLogRepository extends MongoRepository<IncidentLog, String> {

    List<IncidentLog> findBySupportRequestId(Long supportRequestId);

    List<IncidentLog> findByProjectId(Long projectId);
}