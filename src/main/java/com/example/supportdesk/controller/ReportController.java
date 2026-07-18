package com.example.supportdesk.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.supportdesk.dto.ReportCountResponse;
import com.example.supportdesk.service.TicketReportService;

@RestController
@RequestMapping("/api/v1/reports")
public class ReportController {

    private final TicketReportService reportService;

    public ReportController(TicketReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping("/tickets-by-status")
    public List<ReportCountResponse> getTicketsByStatus() {
        return reportService.getTicketsByStatus();
    }

    @GetMapping("/tickets-by-priority")
    public List<ReportCountResponse> getTicketsByPriority() {
        return reportService.countTicketsByPriority();
    }
}