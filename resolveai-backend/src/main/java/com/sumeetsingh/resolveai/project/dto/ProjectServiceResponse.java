package com.sumeetsingh.resolveai.project.dto;

import com.sumeetsingh.resolveai.project.entity.ServiceStatus;

public class ProjectServiceResponse {

    private Long serviceId;
    private String serviceName;
    private String description;
    private String repositoryUrl;
    private String environment;
    private String version;
    private ServiceStatus status;

    public ProjectServiceResponse(
            Long serviceId,
            String serviceName,
            String description,
            String repositoryUrl,
            String environment,
            String version,
            ServiceStatus status
    ) {
        this.serviceId = serviceId;
        this.serviceName = serviceName;
        this.description = description;
        this.repositoryUrl = repositoryUrl;
        this.environment = environment;
        this.version = version;
        this.status = status;
    }

    public Long getServiceId() {
        return serviceId;
    }

    public String getServiceName() {
        return serviceName;
    }

    public String getDescription() {
        return description;
    }

    public String getRepositoryUrl() {
        return repositoryUrl;
    }

    public String getEnvironment() {
        return environment;
    }

    public String getVersion() {
        return version;
    }

    public ServiceStatus getStatus() {
        return status;
    }
}