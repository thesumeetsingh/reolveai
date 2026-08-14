package com.sumeetsingh.resolveai.project.repository;

import com.sumeetsingh.resolveai.project.entity.ProjectServiceEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectServiceRepository
        extends JpaRepository<ProjectServiceEntity, Long> {

    List<ProjectServiceEntity> findByProjectProjectId(Long projectId);

    boolean existsByProjectProjectIdAndServiceNameIgnoreCase(
            Long projectId,
            String serviceName
    );
}