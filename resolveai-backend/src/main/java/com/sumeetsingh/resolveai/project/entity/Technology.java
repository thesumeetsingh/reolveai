package com.sumeetsingh.resolveai.project.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "technologies",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_technology_name",
                        columnNames = "technology_name"
                )
        }
)
public class Technology {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long technologyId;

    @Column(name = "technology_name", nullable = false, length = 100)
    private String technologyName;

    @Column(length = 50)
    private String category;

    @Column(length = 50)
    private String version;

    public Technology() {
    }

    public Technology(
            String technologyName,
            String category,
            String version
    ) {
        this.technologyName = technologyName;
        this.category = category;
        this.version = version;
    }

    public Long getTechnologyId() {
        return technologyId;
    }

    public void setTechnologyId(Long technologyId) {
        this.technologyId = technologyId;
    }

    public String getTechnologyName() {
        return technologyName;
    }

    public void setTechnologyName(String technologyName) {
        this.technologyName = technologyName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}