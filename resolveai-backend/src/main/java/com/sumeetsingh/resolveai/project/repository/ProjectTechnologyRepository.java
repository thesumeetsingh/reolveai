package com.sumeetsingh.resolveai.project.repository;

import com.sumeetsingh.resolveai.project.entity.ProjectTechnology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectTechnologyRepository
        extends JpaRepository<ProjectTechnology, Long> {

    List<ProjectTechnology> findByProjectProjectId(Long projectId);

    Optional<ProjectTechnology> findByProjectProjectIdAndTechnologyTechnologyId(
            Long projectId,
            Long technologyId
    );
}