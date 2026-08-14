package com.sumeetsingh.resolveai.support.service;

import com.sumeetsingh.resolveai.project.entity.Project;
import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.project.repository.ProjectRepository;
import com.sumeetsingh.resolveai.support.dto.CreateSupportRequest;
import com.sumeetsingh.resolveai.support.dto.SupportRequestResponse;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public SupportRequestService(
            SupportRequestRepository supportRequestRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository
    ) {
        this.supportRequestRepository = supportRequestRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public SupportRequestResponse createRequest(
            CreateSupportRequest request,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Project project = projectRepository.findById(
                request.getProjectId()
        ).orElseThrow(() ->
                new IllegalArgumentException("Project not found")
        );

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                project.getProjectId(),
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

        SupportRequest supportRequest =
                new SupportRequest();

        supportRequest.setTicketNumber(
                generateTicketNumber()
        );

        supportRequest.setProject(project);
        supportRequest.setReportedBy(user);

        supportRequest.setTitle(request.getTitle());
        supportRequest.setDescription(request.getDescription());
        supportRequest.setIncidentType(request.getIncidentType());
        supportRequest.setSeverity(request.getSeverity());

        supportRequest.setEnvironment(
                request.getEnvironment()
        );

        supportRequest.setAffectedService(
                request.getAffectedService()
        );

        supportRequest.setAffectedVersion(
                request.getAffectedVersion()
        );

        supportRequest.setErrorCode(
                request.getErrorCode()
        );

        supportRequest.setExpectedBehavior(
                request.getExpectedBehavior()
        );

        supportRequest.setActualBehavior(
                request.getActualBehavior()
        );

        SupportRequest saved =
                supportRequestRepository.save(
                        supportRequest
                );

        return toResponse(saved);
    }

    private String generateTicketNumber() {

        return "RAI-" +
                UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    }

    private SupportRequestResponse toResponse(
            SupportRequest request
    ) {

        User reportedBy = request.getReportedBy();

        User assignedTo = request.getAssignedTo();

        return new SupportRequestResponse(
                request.getSupportRequestId(),
                request.getTicketNumber(),

                request.getProject().getProjectId(),
                request.getProject().getProjectCode(),
                request.getProject().getProjectName(),

                reportedBy.getUserId(),
                reportedBy.getUsername(),

                assignedTo != null
                        ? assignedTo.getUserId()
                        : null,

                assignedTo != null
                        ? assignedTo.getUsername()
                        : null,

                request.getTitle(),
                request.getDescription(),

                request.getIncidentType(),
                request.getSeverity(),
                request.getStatus(),

                request.getEnvironment(),
                request.getAffectedService(),
                request.getAffectedVersion(),
                request.getErrorCode(),

                request.getExpectedBehavior(),
                request.getActualBehavior(),
                request.getResolutionSummary(),

                request.getCreatedAt(),
                request.getUpdatedAt(),
                request.getResolvedAt()
        );
    }
}