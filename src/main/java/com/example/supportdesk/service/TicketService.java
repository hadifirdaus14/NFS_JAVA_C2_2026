package com.example.supportdesk.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.exception.ResourceNotFoundException;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;

@Service
public class TicketService {

    private final TicketRepository ticketRepository;

    // Inject the MongoDB repository via the constructor
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getAllTickets() {
        // 1. Retrieve all ticket documents from MongoDB
        List<Ticket> tickets = ticketRepository.findAll();
        
        // 2. Convert them into TicketResponse DTOs using a stream
        return tickets.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public TicketResponse getTicketById(String id) {
        // Search MongoDB by ID, throw exception if not found
        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));
                
        // Return the DTO
        return mapToResponse(ticket);
    }

    public TicketResponse createTicket(CreateTicketRequest request) {
        // Create a new Ticket entity from the incoming request data
        Ticket newTicket = new Ticket();
        newTicket.setTitle(request.getTitle());
        newTicket.setDescription(request.getDescription());
        newTicket.setCategory(request.getCategory());
        newTicket.setPriority(request.getPriority());
        newTicket.setStatus("Open"); // Default status for new tickets
        newTicket.setCreatedBy(request.getCreatedBy());
        newTicket.setCreatedAt(new java.util.Date().toString()); // Set the current date/time as a string

        // Save it to MongoDB! MongoDB will automatically generate the 'id'
        Ticket savedTicket = ticketRepository.save(newTicket);

        // Convert the saved entity back to a DTO for the response
        return mapToResponse(savedTicket);
    }

    // Helper method to convert a Ticket (Model) into a TicketResponse (DTO)
    private TicketResponse mapToResponse(Ticket ticket) {
        return new TicketResponse(
            ticket.getId(),
            ticket.getTitle(),
            ticket.getDescription(),
            ticket.getCategory(),
            ticket.getPriority(),
            ticket.getStatus(),
            ticket.getCreatedBy(),
            // Convert the MongoDB Date object to a String for the DTO
            ticket.getCreatedAt() != null ? ticket.getCreatedAt().toString() : null 
        );
    }
}