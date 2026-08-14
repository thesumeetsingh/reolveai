package com.sumeetsingh.resolveai.incident.service;

import java.time.LocalDateTime;
import java.util.List;

import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.user.repository.UserRepository;
import org.springframework.stereotype.Service;

import com.sumeetsingh.resolveai.incident.document.IncidentLog;
import com.sumeetsingh.resolveai.incident.repository.IncidentLogRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;
import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.incident.dto.CreateIncidentLogRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncidentLogService {
    private final UserRepository userRepository;
    private final ProjectMemberRepository projectMemberRepository;

    private final IncidentLogRepository incidentLogRepository;


    public IncidentLog saveLog(
            CreateIncidentLogRequest request,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                request.getProjectId(),
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "You do not have access to this project"
                                )
                        );

        if (member.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "You are not an active project member"
            );
        }

        IncidentLog incidentLog = IncidentLog.builder()
                .supportRequestId(request.getSupportRequestId())
                .projectId(request.getProjectId())
                .uploadedBy(user.getUserId())
                .source(request.getSource())
                .logType(request.getLogType())
                .fileName(request.getFileName())
                .content(request.getContent())
                .environment(request.getEnvironment())
                .serviceName(request.getServiceName())
                .uploadedAt(LocalDateTime.now())
                .build();

        return incidentLogRepository.save(incidentLog);
    }

    public List<IncidentLog> getLogsBySupportRequest(Long supportRequestId) {

        return incidentLogRepository.findBySupportRequestId(supportRequestId);
    }

    public List<IncidentLog> getLogsByProject(Long projectId) {

        return incidentLogRepository.findByProjectId(projectId);
    }


}