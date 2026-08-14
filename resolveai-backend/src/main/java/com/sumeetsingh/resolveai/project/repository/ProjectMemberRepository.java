package com.sumeetsingh.resolveai.project.repository;

import com.sumeetsingh.resolveai.project.entity.ProjectMember;
import com.sumeetsingh.resolveai.project.entity.ProjectMemberStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository
        extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByUserUserIdAndStatus(
            Long userId,
            ProjectMemberStatus status
    );

    boolean existsByProjectProjectIdAndUserUserId(
            Long projectId,
            Long userId
    );
    List<ProjectMember> findByProjectProjectIdAndStatus(
            Long projectId,
            ProjectMemberStatus status
    );

    Optional<ProjectMember> findByProjectProjectIdAndUserUserId(
            Long projectId,
            Long userId
    );
}