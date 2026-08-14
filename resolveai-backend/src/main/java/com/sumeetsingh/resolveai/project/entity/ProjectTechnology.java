package com.sumeetsingh.resolveai.project.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "project_technologies",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_project_technology",
                        columnNames = {"project_id", "technology_id"}
                )
        }
)
public class ProjectTechnology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectTechnologyId;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "technology_id", nullable = false)
    private Technology technology;

    public ProjectTechnology() {
    }

    public ProjectTechnology(Project project, Technology technology) {
        this.project = project;
        this.technology = technology;
    }

    public Long getProjectTechnologyId() {
        return projectTechnologyId;
    }

    public void setProjectTechnologyId(Long projectTechnologyId) {
        this.projectTechnologyId = projectTechnologyId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Technology getTechnology() {
        return technology;
    }

    public void setTechnology(Technology technology) {
        this.technology = technology;
    }
}