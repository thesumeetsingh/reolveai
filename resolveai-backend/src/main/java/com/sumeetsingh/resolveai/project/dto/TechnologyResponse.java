package com.sumeetsingh.resolveai.project.dto;

public class TechnologyResponse {

    private Long technologyId;
    private String technologyName;
    private String category;
    private String version;

    public TechnologyResponse(
            Long technologyId,
            String technologyName,
            String category,
            String version
    ) {
        this.technologyId = technologyId;
        this.technologyName = technologyName;
        this.category = category;
        this.version = version;
    }

    public Long getTechnologyId() {
        return technologyId;
    }

    public String getTechnologyName() {
        return technologyName;
    }

    public String getCategory() {
        return category;
    }

    public String getVersion() {
        return version;
    }
}