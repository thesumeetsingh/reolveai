package com.sumeetsingh.resolveai.admin.service;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import com.sumeetsingh.resolveai.admin.dto.AdminDashboardResponse;
import com.sumeetsingh.resolveai.project.entity.ProjectStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectRepository;
import com.sumeetsingh.resolveai.support.entity.IncidentSeverity;
import com.sumeetsingh.resolveai.support.entity.IncidentStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumeetsingh.resolveai.admin.dto.AdminUserResponse;
import com.sumeetsingh.resolveai.incident.document.IncidentActivity;
import com.sumeetsingh.resolveai.incident.document.IncidentAttachment;
import com.sumeetsingh.resolveai.incident.document.IncidentLog;
import com.sumeetsingh.resolveai.incident.repository.IncidentActivityRepository;
import com.sumeetsingh.resolveai.incident.repository.IncidentAttachmentRepository;
import com.sumeetsingh.resolveai.incident.repository.IncidentLogRepository;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    private final SupportRequestRepository supportRequestRepository;

    private final IncidentLogRepository incidentLogRepository;

    private final IncidentActivityRepository incidentActivityRepository;

    private final IncidentAttachmentRepository incidentAttachmentRepository;
    private final ProjectRepository projectRepository;


    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(user ->
                        new AdminUserResponse(
                                user.getUserId(),
                                user.getUsername(),
                                user.getEmail(),
                                user.getFirstName(),
                                user.getLastName(),
                                user.getMobile(),
                                user.getStatus()
                        )
                )
                .toList();
    }


    @Transactional(readOnly = true)
    public List<SupportRequest> getAllSupportRequests() {

        return supportRequestRepository.findAll();
    }


    @Transactional(readOnly = true)
    public List<IncidentLog> getIncidentLogs(
            Long supportRequestId
    ) {

        return incidentLogRepository
                .findBySupportRequestId(
                        supportRequestId
                );
    }


    @Transactional(readOnly = true)
    public List<IncidentActivity> getIncidentActivities(
            Long supportRequestId
    ) {

        return incidentActivityRepository
                .findBySupportRequestIdOrderByCreatedAtAsc(
                        supportRequestId
                );
    }


    @Transactional(readOnly = true)
    public List<IncidentAttachment> getIncidentAttachments(
            Long supportRequestId
    ) {

        return incidentAttachmentRepository
                .findBySupportRequestId(
                        supportRequestId
                );
    }

    @Transactional(readOnly = true)
    public AdminDashboardResponse getDashboard() {

        long totalEmployees =
                userRepository.count();

        long activeProjects =
                projectRepository.countByStatus(
                        ProjectStatus.ACTIVE
                );

        long openIncidents =
                supportRequestRepository.countByStatus(
                        IncidentStatus.OPEN
                );

        long criticalIncidents =
                supportRequestRepository.countBySeverity(
                        IncidentSeverity.CRITICAL
                );

        long resolvedIncidents =
                supportRequestRepository.countByStatus(
                        IncidentStatus.RESOLVED
                );

        Map<String, Long> incidentsBySeverity =
                new LinkedHashMap<>();

        for (IncidentSeverity severity :
                IncidentSeverity.values()) {

            incidentsBySeverity.put(
                    severity.name(),
                    supportRequestRepository
                            .countBySeverity(severity)
            );
        }

        Map<String, Long> incidentsByStatus =
                new LinkedHashMap<>();

        for (IncidentStatus status :
                IncidentStatus.values()) {

            incidentsByStatus.put(
                    status.name(),
                    supportRequestRepository
                            .countByStatus(status)
            );
        }

        return new AdminDashboardResponse(
                totalEmployees,
                activeProjects,
                openIncidents,
                criticalIncidents,
                resolvedIncidents,
                incidentsBySeverity,
                incidentsByStatus
        );
    }
}