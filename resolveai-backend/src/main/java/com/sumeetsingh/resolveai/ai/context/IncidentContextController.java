package com.sumeetsingh.resolveai.ai.context;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import com.sumeetsingh.resolveai.project.repository.ProjectMemberRepository;
import com.sumeetsingh.resolveai.support.repository.SupportRequestRepository;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/ai/context")
@RequiredArgsConstructor
public class IncidentContextController {

    private final IncidentContextService contextService;

    private final UserRepository userRepository;
    private final SupportRequestRepository supportRequestRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @GetMapping("/{supportRequestId}")
    public ResponseEntity<IncidentContext> getContext(
            @PathVariable Long supportRequestId,
            Authentication authentication
    ) {

        User user =
                userRepository.findByUsername(
                        authentication.getName()
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        )
                );

        var incident =
                supportRequestRepository.findById(
                        supportRequestId
                ).orElseThrow(() ->
                        new IllegalArgumentException(
                                "Support request not found"
                        )
                );

        Long projectId =
                incident.getProject().getProjectId();

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

        return ResponseEntity.ok(
                contextService.buildContext(
                        supportRequestId
                )
        );
    }
}