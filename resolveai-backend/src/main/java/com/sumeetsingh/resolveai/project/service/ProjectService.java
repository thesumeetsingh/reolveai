package com.sumeetsingh.resolveai.project.service;

import com.sumeetsingh.resolveai.project.dto.*;
import com.sumeetsingh.resolveai.project.entity.*;
import com.sumeetsingh.resolveai.project.repository.*;
import com.sumeetsingh.resolveai.user.entity.User;
import com.sumeetsingh.resolveai.user.repository.UserRepository;


import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;
    private final TechnologyRepository technologyRepository;
    private final ProjectTechnologyRepository projectTechnologyRepository;
    private final ProjectServiceRepository projectServiceRepository;

    public ProjectService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserRepository userRepository,
            TechnologyRepository technologyRepository,
            ProjectTechnologyRepository projectTechnologyRepository,
            ProjectServiceRepository projectServiceRepository
    ) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
        this.technologyRepository = technologyRepository;
        this.projectTechnologyRepository = projectTechnologyRepository;
        this.projectServiceRepository = projectServiceRepository;
    }
    private Project getProjectAndVerifyManager(
            Long projectId,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "You are not a member of this project"
                                )
                        );

        if (member.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "You are not an active member of this project"
            );
        }

        if (member.getProjectRole() != ProjectMemberRole.OWNER
                && member.getProjectRole()
                != ProjectMemberRole.PROJECT_MANAGER) {

            throw new IllegalArgumentException(
                    "You do not have permission to manage project members"
            );
        }

        return member.getProject();
    }

    private ProjectMemberResponse toMemberResponse(
            ProjectMember member
    ) {

        User user = member.getUser();

        return new ProjectMemberResponse(
                user.getUserId(),
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                member.getProjectRole(),
                member.getStatus()
        );
    }

    @Transactional
    public ProjectResponse createProject(
            CreateProjectRequest request,
            String username
    ) {

        if (projectRepository.existsByProjectCode(request.getProjectCode())) {
            throw new IllegalArgumentException(
                    "Project code already exists"
            );
        }

        User owner = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        Project project = new Project();

        project.setProjectCode(request.getProjectCode());
        project.setProjectName(request.getProjectName());
        project.setDescription(request.getDescription());
        project.setRepositoryUrl(request.getRepositoryUrl());
        project.setOwner(owner);

        Project savedProject = projectRepository.save(project);

        ProjectMember ownerMember = new ProjectMember();

        ownerMember.setProject(savedProject);
        ownerMember.setUser(owner);
        ownerMember.setProjectRole(ProjectMemberRole.OWNER);

        projectMemberRepository.save(ownerMember);

        return toResponse(savedProject);
    }

    private ProjectResponse toResponse(Project project) {

        return new ProjectResponse(
                project.getProjectId(),
                project.getProjectCode(),
                project.getProjectName(),
                project.getDescription(),
                project.getOwner().getUserId(),
                project.getOwner().getUsername(),
                project.getStatus(),
                project.getRepositoryUrl(),
                project.getCreatedAt()
        );
    }
    @Transactional(readOnly = true)
    public List<ProjectSummaryResponse> getMyProjects(String username) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        List<ProjectMember> memberships =
                projectMemberRepository.findByUserUserIdAndStatus(
                        user.getUserId(),
                        ProjectMemberStatus.ACTIVE
                );

        return memberships.stream()
                .map(ProjectMember::getProject)
                .map(project -> new ProjectSummaryResponse(
                        project.getProjectId(),
                        project.getProjectCode(),
                        project.getProjectName(),
                        project.getStatus()
                ))
                .toList();
    }

    @Transactional(readOnly = true)
    public ProjectDetailsResponse getProject(
            Long projectId,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        ProjectMember membership =
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

        if (membership.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }

        Project project = membership.getProject();

        List<ProjectMemberResponse> members =
                projectMemberRepository
                        .findByProjectProjectIdAndStatus(
                                projectId,
                                ProjectMemberStatus.ACTIVE
                        )
                        .stream()
                        .map(member -> new ProjectMemberResponse(
                                member.getUser().getUserId(),
                                member.getUser().getUsername(),
                                member.getUser().getFirstName(),
                                member.getUser().getLastName(),
                                member.getProjectRole(),
                                member.getStatus()
                        ))
                        .toList();

        return new ProjectDetailsResponse(
                project.getProjectId(),
                project.getProjectCode(),
                project.getProjectName(),
                project.getDescription(),
                project.getOwner().getUserId(),
                project.getOwner().getUsername(),
                project.getStatus(),
                project.getRepositoryUrl(),
                project.getCreatedAt(),
                project.getUpdatedAt(),
                members
        );
    }

    @Transactional
    public ProjectMemberResponse addMember(
            Long projectId,
            AddProjectMemberRequest request,
            String username
    ) {

        Project project = getProjectAndVerifyManager(projectId, username);

        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

        if (projectMemberRepository.existsByProjectProjectIdAndUserUserId(
                projectId,
                user.getUserId()
        )) {
            throw new IllegalArgumentException(
                    "User is already a member of this project"
            );
        }

        ProjectMember member = new ProjectMember();

        member.setProject(project);
        member.setUser(user);
        member.setProjectRole(request.getProjectRole());

        ProjectMember savedMember =
                projectMemberRepository.save(member);

        return toMemberResponse(savedMember);
    }
    @Transactional
    public ProjectMemberResponse updateMemberRole(
            Long projectId,
            Long userId,
            UpdateProjectMemberRequest request,
            String username
    ) {

        getProjectAndVerifyManager(projectId, username);

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                userId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Project member not found"
                                )
                        );

        if (member.getProjectRole() == ProjectMemberRole.OWNER) {
            throw new IllegalArgumentException(
                    "Owner role cannot be changed"
            );
        }

        member.setProjectRole(request.getProjectRole());

        return toMemberResponse(
                projectMemberRepository.save(member)
        );
    }

    @Transactional
    public void removeMember(
            Long projectId,
            Long userId,
            String username
    ) {

        getProjectAndVerifyManager(projectId, username);

        ProjectMember member =
                projectMemberRepository
                        .findByProjectProjectIdAndUserUserId(
                                projectId,
                                userId
                        )
                        .orElseThrow(() ->
                                new IllegalArgumentException(
                                        "Project member not found"
                                )
                        );

        if (member.getProjectRole() == ProjectMemberRole.OWNER) {
            throw new IllegalArgumentException(
                    "Project owner cannot be removed"
            );
        }

        member.setStatus(ProjectMemberStatus.REMOVED);

        projectMemberRepository.save(member);
    }

    @Transactional
    public TechnologyResponse addTechnology(
            Long projectId,
            TechnologyRequest request,
            String username
    ) {

        Project project = getProjectAndVerifyManager(
                projectId,
                username
        );

        Technology technology =
                technologyRepository
                        .findByTechnologyNameIgnoreCase(
                                request.getTechnologyName()
                        )
                        .orElseGet(() ->
                                technologyRepository.save(
                                        new Technology(
                                                request.getTechnologyName(),
                                                request.getCategory(),
                                                request.getVersion()
                                        )
                                )
                        );

        if (projectTechnologyRepository
                .findByProjectProjectIdAndTechnologyTechnologyId(
                        projectId,
                        technology.getTechnologyId()
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Technology already added to this project"
            );
        }

        ProjectTechnology projectTechnology =
                new ProjectTechnology(project, technology);

        projectTechnologyRepository.save(projectTechnology);

        return new TechnologyResponse(
                technology.getTechnologyId(),
                technology.getTechnologyName(),
                technology.getCategory(),
                technology.getVersion()
        );
    }

    @Transactional(readOnly = true)
    public List<TechnologyResponse> getProjectTechnologies(
            Long projectId,
            String username
    ) {

        getProjectAndVerifyMember(projectId, username);

        return projectTechnologyRepository
                .findByProjectProjectId(projectId)
                .stream()
                .map(ProjectTechnology::getTechnology)
                .map(technology -> new TechnologyResponse(
                        technology.getTechnologyId(),
                        technology.getTechnologyName(),
                        technology.getCategory(),
                        technology.getVersion()
                ))
                .toList();
    }

    private Project getProjectAndVerifyMember(
            Long projectId,
            String username
    ) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found")
                );

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

        if (member.getStatus() != ProjectMemberStatus.ACTIVE) {
            throw new IllegalArgumentException(
                    "You do not have access to this project"
            );
        }

        return member.getProject();
    }

    @Transactional
    public ProjectServiceResponse addProjectService(
            Long projectId,
            CreateProjectServiceRequest request,
            String username
    ) {

        Project project = getProjectAndVerifyManager(
                projectId,
                username
        );

        if (projectServiceRepository
                .existsByProjectProjectIdAndServiceNameIgnoreCase(
                        projectId,
                        request.getServiceName()
                )) {

            throw new IllegalArgumentException(
                    "Service already exists in this project"
            );
        }

        ProjectServiceEntity service =
                new ProjectServiceEntity();

        service.setProject(project);
        service.setServiceName(request.getServiceName());
        service.setDescription(request.getDescription());
        service.setRepositoryUrl(request.getRepositoryUrl());
        service.setEnvironment(request.getEnvironment());
        service.setVersion(request.getVersion());

        ProjectServiceEntity saved =
                projectServiceRepository.save(service);

        return toServiceResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ProjectServiceResponse> getProjectServices(
            Long projectId,
            String username
    ) {

        getProjectAndVerifyMember(projectId, username);

        return projectServiceRepository
                .findByProjectProjectId(projectId)
                .stream()
                .map(this::toServiceResponse)
                .toList();
    }

    private ProjectServiceResponse toServiceResponse(
            ProjectServiceEntity service
    ) {

        return new ProjectServiceResponse(
                service.getServiceId(),
                service.getServiceName(),
                service.getDescription(),
                service.getRepositoryUrl(),
                service.getEnvironment(),
                service.getVersion(),
                service.getStatus()
        );
    }
}