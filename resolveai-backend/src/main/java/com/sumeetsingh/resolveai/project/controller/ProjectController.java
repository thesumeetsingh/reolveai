package com.sumeetsingh.resolveai.project.controller;

import com.sumeetsingh.resolveai.project.dto.*;
import com.sumeetsingh.resolveai.project.service.ProjectService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectResponse> createProject(
            @Valid @RequestBody CreateProjectRequest request,
            Authentication authentication
    ) {

        ProjectResponse response =
                projectService.createProject(
                        request,
                        authentication.getName()
                );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ProjectSummaryResponse>> getMyProjects(
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectService.getMyProjects(
                        authentication.getName()
                )
        );
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailsResponse> getProject(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectService.getProject(
                        projectId,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<ProjectMemberResponse> addMember(
            @PathVariable Long projectId,
            @Valid @RequestBody AddProjectMemberRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        projectService.addMember(
                                projectId,
                                request,
                                authentication.getName()
                        )
                );
    }

    @PutMapping("/{projectId}/members/{userId}")
    public ResponseEntity<ProjectMemberResponse> updateMemberRole(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            @Valid @RequestBody UpdateProjectMemberRequest request,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectService.updateMemberRole(
                        projectId,
                        userId,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable Long projectId,
            @PathVariable Long userId,
            Authentication authentication
    ) {

        projectService.removeMember(
                projectId,
                userId,
                authentication.getName()
        );

        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/technologies")
    public ResponseEntity<TechnologyResponse> addTechnology(
            @PathVariable Long projectId,
            @Valid @RequestBody TechnologyRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        projectService.addTechnology(
                                projectId,
                                request,
                                authentication.getName()
                        )
                );
    }

    @GetMapping("/{projectId}/technologies")
    public ResponseEntity<List<TechnologyResponse>> getProjectTechnologies(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectService.getProjectTechnologies(
                        projectId,
                        authentication.getName()
                )
        );
    }

    @PostMapping("/{projectId}/services")
    public ResponseEntity<ProjectServiceResponse> addProjectService(
            @PathVariable Long projectId,
            @Valid @RequestBody CreateProjectServiceRequest request,
            Authentication authentication
    ) {

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(
                        projectService.addProjectService(
                                projectId,
                                request,
                                authentication.getName()
                        )
                );
    }

    @GetMapping("/{projectId}/services")
    public ResponseEntity<List<ProjectServiceResponse>> getProjectServices(
            @PathVariable Long projectId,
            Authentication authentication
    ) {

        return ResponseEntity.ok(
                projectService.getProjectServices(
                        projectId,
                        authentication.getName()
                )
        );
    }


}