package com.sumeetsingh.resolveai.employee.dto;

import java.util.List;

import com.sumeetsingh.resolveai.support.entity.SupportRequest;

public record EmployeeDashboardResponse(

        long myProjects,

        long myReportedIncidents,

        long myAssignedIncidents,

        long openIncidents,

        long criticalIncidents,

        long resolvedIncidents,

        List<SupportRequest> recentReportedIncidents

) {
}