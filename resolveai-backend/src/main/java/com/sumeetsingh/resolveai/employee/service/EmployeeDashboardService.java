package com.sumeetsingh.resolveai.employee.service;

import java.util.Comparator;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumeetsingh.resolveai.employee.dto.EmployeeDashboardResponse;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.support.entity.IncidentSeverity;
import com.sumeetsingh.resolveai.support.entity.IncidentStatus;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EmployeeDashboardService {

    private final UserRepository userRepository;

    private final ProjectMemberRepository projectMemberRepository;

    private final SupportRequestRepository supportRequestRepository;

    @Transactional(readOnly = true)
    public EmployeeDashboardResponse getDashboard(
            String username
    ) {

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        Long userId = user.getUserId();

        long myProjects =
                projectMemberRepository
                        .countByUserUserIdAndStatus(
                                userId,
                                ProjectMemberStatus.ACTIVE
                        );

        long myReportedIncidents =
                supportRequestRepository
                        .findByReportedByUserId(userId)
                        .size();

        long myAssignedIncidents =
                supportRequestRepository
                        .findByAssignedToUserId(userId)
                        .size();

        long openIncidents =
                supportRequestRepository
                        .countByReportedByUserIdAndStatus(
                                userId,
                                IncidentStatus.OPEN
                        );

        long criticalIncidents =
                supportRequestRepository
                        .countByReportedByUserIdAndSeverity(
                                userId,
                                IncidentSeverity.CRITICAL
                        );

        long resolvedIncidents =
                supportRequestRepository
                        .countByReportedByUserIdAndStatus(
                                userId,
                                IncidentStatus.RESOLVED
                        );

        List<SupportRequest> recentReportedIncidents =
                supportRequestRepository
                        .findByReportedByUserId(userId)
                        .stream()
                        .sorted(
                                Comparator.comparing(
                                        SupportRequest::getCreatedAt
                                ).reversed()
                        )
                        .limit(5)
                        .toList();

        return new EmployeeDashboardResponse(
                myProjects,
                myReportedIncidents,
                myAssignedIncidents,
                openIncidents,
                criticalIncidents,
                resolvedIncidents,
                recentReportedIncidents
        );
    }
}