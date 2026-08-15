package com.sumeetsingh.resolveai.admin.dto;

import java.util.Map;

public record AdminDashboardResponse(

        long totalEmployees,

        long activeProjects,

        long openIncidents,

        long criticalIncidents,

        long resolvedIncidents,

        Map<String, Long> incidentsBySeverity,

        Map<String, Long> incidentsByStatus

) {
}