package com.sumeetsingh.resolveai.support.repository;

import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.entity.IncidentStatus;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SupportRequestRepository
        extends JpaRepository<SupportRequest, Long> {

    Optional<SupportRequest> findByTicketNumber(
            String ticketNumber
    );

    List<SupportRequest> findByProjectProjectId(
            Long projectId
    );

    List<SupportRequest> findByProjectProjectIdAndStatus(
            Long projectId,
            IncidentStatus status
    );

    List<SupportRequest> findByReportedByUserId(
            Long userId
    );

    List<SupportRequest> findByAssignedToUserId(
            Long userId
    );

    boolean existsByTicketNumber(String ticketNumber);
}