package com.example.supportdesk.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.supportdesk.dto.TicketResponse;

@Service
public class TicketService {
    private final List<TicketResponse> tickets = new ArrayList<>();

    public TicketService() {
        tickets.add(new TicketResponse(
            "T001",
            "Sample Ticket 1",
            "This is a sample ticket description.",
            "Software",
            "High",
            "Open",
            "John Doe",
            "2024-06-01"
        ));

        tickets.add(new TicketResponse(
            "T002",
            "Sample Ticket 2",
            "This is another sample ticket description.",
            "Hardware",
            "Medium",
            "In Progress",
            "Jane Smith",
            "2024-06-02"
        ));

        tickets.add(new TicketResponse(
            "T003",
            "Sample Ticket 3",
            "This is yet another sample ticket description.",
            "Network",
            "Low",
            "Closed",
            "Alice Johnson",
            "2024-06-03"
        ));
    }

    public List<TicketResponse> getAllTickets() {
        return tickets;
    }

    public TicketResponse getTicketById(String id) {
        return tickets.stream()
                .filter(ticket -> ticket.getId().equalsIgnoreCase(id))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Ticket " + id + " was not found"));
    }

    private String generateTicketId() {
        return "T" + String.format("%03d", tickets.size() + 1);
    }

}
