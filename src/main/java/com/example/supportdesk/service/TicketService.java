package com.example.supportdesk.service;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.example.supportdesk.exception.InvalidRequestException;
import com.example.supportdesk.dto.CreateTicketRequest;
import com.example.supportdesk.dto.TicketResponse;
import com.example.supportdesk.dto.UpdateTicketRequest;
import com.example.supportdesk.exception.DuplicateResourceException;
import com.example.supportdesk.exception.ResourceNotFoundException;
import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;

@Service
public class TicketService {

    private static final Logger logger = LoggerFactory.getLogger(TicketService.class);

    private final TicketRepository ticketRepository;

    private static final Set<String> ALLOWED_STATUSES = Set.of(
            "OPEN", 
            "IN PROGRESS", 
            "RESOLVED", 
            "CLOSED"
    );

    private static final Set<String> ALLOWED_PRIORITIES = Set.of(
            "LOW", 
            "MEDIUM", 
            "HIGH", 
            "CRITICAL"
    );

    // Inject the MongoDB repository via the constructor
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getAllTickets(String status, String priority, String category) {
        List<Ticket> tickets;

        // Check which filter was provided and call the matching repository method
        if (status != null && !status.trim().isEmpty()) {
            tickets = ticketRepository.findByStatusIgnoreCase(status);
        } else if (priority != null && !priority.trim().isEmpty()) {
            tickets = ticketRepository.findByPriorityIgnoreCase(priority);
        } else if (category != null && !category.trim().isEmpty()) {
            tickets = ticketRepository.findByCategoryIgnoreCase(category);
        } else {
            // If no filters are provided, return everything
            tickets = ticketRepository.findAll();
        }
        
        // Convert the resulting entities into TicketResponse DTOs
        return tickets.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public Page<TicketResponse> getTicketsPaged(int page, int size, String sortBy, String direction) {
        // 1. Determine the sort direction dynamically
        Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Sort sort = Sort.by(sortDirection, sortBy);
        
        // 2. Create the Pageable object
        Pageable pageable = PageRequest.of(page, size, sort);
        
        // 3. Fetch the specific page from MongoDB
        Page<Ticket> ticketPage = ticketRepository.findAll(pageable);
        
        // 4. Convert Page<Ticket> to Page<TicketResponse>
        // The Page object has a built-in .map() function specifically for DTO conversion!
        return ticketPage.map(this::mapToResponse);
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

    public TicketResponse updateTicket(String id, UpdateTicketRequest request){
        logger.info("Updating ticket with id={}", id);

        Ticket ticket = ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));

        String title = request.getTitle().trim();
        String priority = request.getPriority().trim();
        String status = request.getStatus().trim();

        validateStatus(status);
        validatePriority(priority);

        if(!ticket.getTitle().equalsIgnoreCase(title) && ticketRepository.existsByTitle(title)) {
            throw new DuplicateResourceException("Ticket title already exists: " + title);
        }

        ticket.setTitle(title);
        ticket.setCategory(request.getCategory().trim());
        ticket.setDescription(request.getDescription().trim());
        ticket.setPriority(priority);
        ticket.setStatus(status);

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket);
    }

    private void validateStatus(String status) {
        if (!ALLOWED_STATUSES.contains(status)) {
            throw new InvalidRequestException("Invalid status: " + status + ". Allowed statuses are: " + ALLOWED_STATUSES);
        }
    }

    private void validatePriority(String priority) {
        if (!ALLOWED_PRIORITIES.contains(priority)) {
            throw new InvalidRequestException("Invalid priority: " + priority + ". Allowed priorities are: " + ALLOWED_PRIORITIES);
        }
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