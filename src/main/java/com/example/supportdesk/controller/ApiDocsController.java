package com.example.supportdesk.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.supportdesk.dto.ApiDocumentationResponse;
import com.example.supportdesk.dto.ApiEndpointResponse;

@RestController
@RequestMapping("/api/docs")
public class ApiDocsController {

    @GetMapping
    public ApiDocumentationResponse getDocumentation() {
        return new ApiDocumentationResponse(
                "Support Desk Ticket API",
                "v1",
                "/api/v1",
                List.of(
                        new ApiEndpointResponse("GET", "/api/health", "Public", "Check API health status."),
                        new ApiEndpointResponse("POST", "/api/auth/register", "Public", "Register a new user account."),
                        new ApiEndpointResponse("POST", "/api/auth/login", "Public", "Login and receive a JWT bearer token."),
                        new ApiEndpointResponse("GET", "/api/v1/tickets", "USER or ADMIN", "List all support tickets."),
                        new ApiEndpointResponse("GET", "/api/v1/tickets/{id}", "USER or ADMIN", "Get one ticket by MongoDB id."),
                        new ApiEndpointResponse("POST", "/api/v1/tickets", "USER or ADMIN", "Create a new support ticket."),
                        new ApiEndpointResponse("GET", "/api/v1/reports/tickets-by-status", "USER or ADMIN", "Count tickets grouped by status."),
                        new ApiEndpointResponse("GET", "/api/v1/reports/tickets-by-priority", "USER or ADMIN", "Count tickets grouped by priority.")
                )
        );
    }
}