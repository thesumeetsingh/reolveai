package com.sumeetsingh.resolveai.ai.context;

import java.util.List;

public record IncidentContext(

        Long supportRequestId,

        String ticketNumber,

        String projectName,

        String projectCode,

        String projectDescription,

        String projectStatus,

        List<String> technologies,

        List<String> services,

        String incidentTitle,

        String incidentDescription,

        String incidentType,

        String severity,

        String status,

        String environment,

        String affectedService,

        String affectedVersion,

        String errorCode,

        String expectedBehavior,

        String actualBehavior,

        List<String> logs,

        List<String> activities
) {
}