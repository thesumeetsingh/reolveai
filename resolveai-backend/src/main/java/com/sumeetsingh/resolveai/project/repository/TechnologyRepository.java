package com.sumeetsingh.resolveai.project.repository;

import com.sumeetsingh.resolveai.project.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TechnologyRepository
        extends JpaRepository<Technology, Long> {

    Optional<Technology> findByTechnologyNameIgnoreCase(
            String technologyName
    );
}