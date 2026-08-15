package com.sumeetsingh.resolveai.support.service;

import com.sumeetsingh.resolveai.incident.document.IncidentActivity;
import com.sumeetsingh.resolveai.incident.dto.AddIncidentCommentRequest;
import com.sumeetsingh.resolveai.incident.dto.AssignIncidentRequest;
import com.sumeetsingh.resolveai.incident.dto.UpdateIncidentStatusRequest;
import com.sumeetsingh.resolveai.incident.repository.IncidentActivityRepository;
import com.sumeetsingh.resolveai.project.entity.Project;
import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberRole;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.project.repository.ProjectRepository;
import com.sumeetsingh.resolveai.support.dto.CreateSupportRequest;
import com.sumeetsingh.resolveai.support.dto.SupportRequestResponse;
import com.sumeetsingh.resolveai.support.entity.IncidentStatus;
import com.sumeetsingh.resolveai.support.entity.SupportRequest;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;
//import com.sumeetsingh.resolveai.support.dto.UpdateIncidentStatusRequest;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class SupportRequestService {

    private final SupportRequestRepository supportRequestRepository;
    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final IncidentActivityRepository incidentActivityRepository;


    public SupportRequestService(
            SupportRequestRepository supportRequestRepository,
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository,
            IncidentActivityRepository incidentActivityRepository
    ) {
        this.supportRequestRepository = supportRequestRepository;
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.incidentActivityRepository=incidentActivityRepository;
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

    @Transactional(readOnly = true)
    public List<SupportRequestResponse> getMySupportRequests(
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        return supportRequestRepository
                .findByReportedByUserId(user.getUserId())
                .stream()
                .sorted((first, second) -> {
                    LocalDateTime firstDate = first.getUpdatedAt() != null
                            ? first.getUpdatedAt()
                            : first.getCreatedAt();
                    LocalDateTime secondDate = second.getUpdatedAt() != null
                            ? second.getUpdatedAt()
                            : second.getCreatedAt();
                    return secondDate.compareTo(firstDate);
                })
                .map(this::toResponse)
                .toList();
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

    private SupportRequest getRequestForMember(
            Long supportRequestId,
            String username
    ) {

        SupportRequest supportRequest =
                supportRequestRepository.findById(
                        supportRequestId
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support request not found"
                        )
                );

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        Long projectId =
                supportRequest
                        .getProject()
                        .getProjectId();

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "You do not have access to this project"
                                )
                        );

        if (member.getStatus()
                != ProjectMemberStatus.ACTIVE) {

            throw new IllegalArgumentException(
                    "You are not an active project member"
            );
        }

        return supportRequest;
    }

    private SupportRequest getRequestForManager(
            Long supportRequestId,
            String username
    ) {

        User user =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        if (isAdmin(user)) {

            return supportRequestRepository.findById(
                    supportRequestId
            ).orElseThrow(() ->
                    new IllegalArgumentException(
                            "Support request not found"
                    )
            );
        }

        SupportRequest supportRequest =
                getRequestForMember(
                        supportRequestId,
                        username
                );

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                supportRequest
                                        .getProject()
                                        .getProjectId(),
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Project membership not found"
                                )
                        );

        if (member.getProjectRole()
                != ProjectMemberRole.OWNER
                && member.getProjectRole()
                != ProjectMemberRole.PROJECT_MANAGER) {

            throw new IllegalArgumentException(
                    "You do not have permission to manage this incident"
            );
        }

        return supportRequest;
    }
//    @Transactional
//    public SupportRequestResponse updateStatus(
//            Long supportRequestId,
//            UpdateIncidentStatusRequest request,
//            String username
//    ) {
//
//        SupportRequest supportRequest =
//                getRequestForMember(
//                        supportRequestId,
//                        username
//                );
//
//        IncidentStatus oldStatus =
//                supportRequest.getStatus();
//
//        IncidentStatus newStatus =
//                request.getStatus();
//
//        if (oldStatus == newStatus) {
//            throw new IllegalArgumentException(
//                    "Incident is already in this status"
//            );
//        }
//
//        supportRequest.setStatus(newStatus);
//
//        if (newStatus == IncidentStatus.RESOLVED
//                || newStatus == IncidentStatus.CLOSED) {
//
//            supportRequest.setResolvedAt(
//                    LocalDateTime.now()
//            );
//        }
//
//        SupportRequest saved =
//                supportRequestRepository.save(
//                        supportRequest
//                );
//
//        User actor =
//                userRepository.findByUsername(username)
//                        .orElseThrow(() ->
//                                new IllegalArgumentException(
//                                        "User not found"
//                                )
//                        );
//
//        IncidentActivity activity =
//                IncidentActivity.builder()
//                        .supportRequestId(
//                                supportRequestId
//                        )
//                        .projectId(
//                                supportRequest
//                                        .getProject()
//                                        .getProjectId()
//                        )
//                        .actorId(actor.getUserId())
//                        .actorUsername(actor.getUsername())
//                        .activityType("STATUS_CHANGED")
//                        .message(
//                                request.getMessage()
//                        )
//                        .oldStatus(
//                                oldStatus.name()
//                        )
//                        .newStatus(
//                                newStatus.name()
//                        )
//                        .createdAt(LocalDateTime.now())
//                        .build();
//
//        incidentActivityRepository.save(activity);
//
//        return toResponse(saved);
//    }

    @Transactional
    public SupportRequestResponse assignIncident(
            Long supportRequestId,
            AssignIncidentRequest request,
            String username
    ) {

        SupportRequest supportRequest =
                getRequestForManager(
                        supportRequestId,
                        username
                );

        User assignee =
                userRepository.findById(
                        request.getUserId()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        Long projectId =
                supportRequest
                        .getProject()
                        .getProjectId();

        ProjectMember assigneeMembership =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                assignee.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User is not a member of this project"
                                )
                        );

        if (assigneeMembership.getStatus()
                != ProjectMemberStatus.ACTIVE) {

            throw new IllegalArgumentException(
                    "User is not an active project member"
            );
        }

        User oldAssignee =
                supportRequest.getAssignedTo();

        supportRequest.setAssignedTo(assignee);

        SupportRequest saved =
                supportRequestRepository.save(
                        supportRequest
                );

        User actor =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        IncidentActivity activity =
                IncidentActivity.builder()
                        .supportRequestId(
                                supportRequestId
                        )
                        .projectId(projectId)
                        .actorId(actor.getUserId())
                        .actorUsername(actor.getUsername())
                        .activityType("ASSIGNED")
                        .message(
                                "Incident assigned to "
                                        + assignee.getUsername()
                        )
                        .oldAssigneeId(
                                oldAssignee != null
                                        ? oldAssignee.getUserId()
                                        : null
                        )
                        .newAssigneeId(
                                assignee.getUserId()
                        )
                        .createdAt(LocalDateTime.now())
                        .build();

        incidentActivityRepository.save(activity);

        return toResponse(saved);
    }

    @Transactional
    public IncidentActivity addComment(
            Long supportRequestId,
            AddIncidentCommentRequest request,
            String username
    ) {

        SupportRequest supportRequest =
                getRequestForMember(
                        supportRequestId,
                        username
                );

        User actor =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        IncidentActivity activity =
                IncidentActivity.builder()
                        .supportRequestId(
                                supportRequestId
                        )
                        .projectId(
                                supportRequest
                                        .getProject()
                                        .getProjectId()
                        )
                        .actorId(actor.getUserId())
                        .actorUsername(actor.getUsername())
                        .activityType("COMMENT")
                        .message(request.getMessage())
                        .createdAt(LocalDateTime.now())
                        .build();

        return incidentActivityRepository.save(
                activity
        );
    }

    @Transactional(readOnly = true)
    public List<IncidentActivity> getActivities(
            Long supportRequestId,
            String username
    ) {

        getRequestForMember(
                supportRequestId,
                username
        );

        return incidentActivityRepository
                .findBySupportRequestIdOrderByCreatedAtAsc(
                        supportRequestId
                );
    }


    @Transactional
    public SupportRequestResponse updateIncidentStatus(
            Long supportRequestId,
            UpdateIncidentStatusRequest request,
            String username
    ) {

        SupportRequest incident =
                supportRequestRepository.findById(
                        supportRequestId
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support request not found"
                        )
                );

        User actor =
                userRepository.findByUsername(username)
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "User not found"
                                )
                        );

        IncidentStatus oldStatus =
                incident.getStatus();

        IncidentStatus newStatus =
                request.getStatus();

        if (oldStatus == newStatus) {

            throw new IllegalArgumentException(
                    "Incident is already in " + newStatus + " status"
            );
        }

        /*
         * Resolution information is required
         * when the incident becomes RESOLVED.
         */
        if (newStatus == IncidentStatus.RESOLVED) {

            if (request.getResolutionSummary() == null
                    || request.getResolutionSummary().isBlank()) {

                throw new IllegalArgumentException(
                        "Resolution summary is required"
                );
            }

            incident.setResolutionSummary(
                    request.getResolutionSummary()
            );

            incident.setResolvedAt(
                    LocalDateTime.now()
            );
        }

        /*
         * Reopening clears the resolved timestamp.
         */
        if (newStatus == IncidentStatus.REOPENED) {

            incident.setResolvedAt(null);
        }

        incident.setStatus(newStatus);

        SupportRequest savedIncident =
                supportRequestRepository.save(
                        incident
                );

        IncidentActivity activity =
                IncidentActivity.builder()
                        .supportRequestId(
                                supportRequestId
                        )
                        .projectId(
                                incident.getProject()
                                        .getProjectId()
                        )
                        .actorId(
                                actor.getUserId()
                        )
                        .actorUsername(
                                actor.getUsername()
                        )
                        .activityType(
                                "STATUS_CHANGED"
                        )
                        .message(
                                request.getMessage() != null
                                        && !request.getMessage().isBlank()
                                        ? request.getMessage()
                                        : "Incident status changed from "
                                        + oldStatus
                                        + " to "
                                        + newStatus
                        )
                        .oldStatus(
                                oldStatus.name()
                        )
                        .newStatus(
                                newStatus.name()
                        )
                        .createdAt(
                                LocalDateTime.now()
                        )
                        .build();

        incidentActivityRepository.save(activity);

        return toResponse(savedIncident);
    }

    private boolean isAdmin(User user) {

        return user.getRoles()
                .stream()
                .anyMatch(role ->
                        "ADMIN".equalsIgnoreCase(
                                role.getRoleName()
                        )
                );
    }
}