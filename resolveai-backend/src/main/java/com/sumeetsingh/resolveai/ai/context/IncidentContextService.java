package com.sumeetsingh.resolveai.ai.context;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sumeetsingh.resolveai.incident.document.IncidentActivity;
import com.sumeetsingh.resolveai.incident.document.IncidentLog;
import com.sumeetsingh.resolveai.incident.repository.IncidentActivityRepository;
import com.sumeetsingh.resolveai.incident.repository.IncidentLogRepository;
import com.sumeetsingh.resolveai.project.entity.Project;
import com.sumeetsingh.resolveai.project.entity.ProjectServiceEntity;
import com.sumeetsingh.resolveai.project.entity.ProjectTechnology;
import com.sumeetsingh.resolveai.project.repository.ProjectRepository;
import com.sumeetsingh.resolveai.project.repository.ProjectServiceRepository;
import com.sumeetsingh.resolveai.project.repository.ProjectTechnologyRepository;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class IncidentContextService {

    private final SupportRequestRepository supportRequestRepository;
    private final ProjectRepository projectRepository;

    private final ProjectTechnologyRepository projectTechnologyRepository;
    private final ProjectServiceRepository projectServiceRepository;

    private final IncidentLogRepository incidentLogRepository;
    private final IncidentActivityRepository incidentActivityRepository;

    @Transactional(readOnly = true)
    public IncidentContext buildContext(
            Long supportRequestId
    ) {

        SupportRequest incident =
                supportRequestRepository.findById(
                        supportRequestId
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support request not found"
                        )
                );

        Project project = incident.getProject();

        List<String> technologies =
                projectTechnologyRepository
                        .findByProjectProjectId(
                                project.getProjectId()
                        )
                        .stream()
                        .map(ProjectTechnology::getTechnology)
                        .map(technology ->
                                technology.getTechnologyName()
                        )
                        .toList();

        List<String> services =
                projectServiceRepository
                        .findByProjectProjectId(
                                project.getProjectId()
                        )
                        .stream()
                        .map(ProjectServiceEntity::getServiceName)
                        .toList();

        List<String> logs =
                incidentLogRepository
                        .findBySupportRequestId(
                                supportRequestId
                        )
                        .stream()
                        .map(this::formatLog)
                        .toList();

        List<String> activities =
                incidentActivityRepository
                        .findBySupportRequestIdOrderByCreatedAtAsc(
                                supportRequestId
                        )
                        .stream()
                        .map(this::formatActivity)
                        .toList();

        return new IncidentContext(

                incident.getSupportRequestId(),

                incident.getTicketNumber(),

                project.getProjectName(),

                project.getProjectCode(),

                project.getDescription(),

                project.getStatus().name(),

                technologies,

                services,

                incident.getTitle(),

                incident.getDescription(),

                incident.getIncidentType().name(),

                incident.getSeverity().name(),

                incident.getStatus().name(),

                incident.getEnvironment(),

                incident.getAffectedService(),

                incident.getAffectedVersion(),

                incident.getErrorCode(),

                incident.getExpectedBehavior(),

                incident.getActualBehavior(),

                logs,

                activities
        );
    }

    private String formatLog(IncidentLog log) {

        return """
                Source: %s
                Type: %s
                Service: %s
                Environment: %s
                File: %s
                Content:
                %s
                """.formatted(
                log.getSource(),
                log.getLogType(),
                log.getServiceName(),
                log.getEnvironment(),
                log.getFileName(),
                log.getContent()
        );
    }

    private String formatActivity(
            IncidentActivity activity
    ) {

        return """
                Time: %s
                Actor: %s
                Activity: %s
                Message: %s
                Old Status: %s
                New Status: %s
                """.formatted(
                activity.getCreatedAt(),
                activity.getActorUsername(),
                activity.getActivityType(),
                activity.getMessage(),
                activity.getOldStatus(),
                activity.getNewStatus()
        );
    }
}