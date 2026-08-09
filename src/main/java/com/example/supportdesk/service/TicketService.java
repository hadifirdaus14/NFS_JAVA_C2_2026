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
            "IN_PROGRESS",
            "CLOSED"
    );

    private static final Set<String> ALLOWED_PRIORITIES = Set.of(
            "LOW",
            "MEDIUM",
            "HIGH"
    );

    // Inject the MongoDB repository via the constructor
    public TicketService(TicketRepository ticketRepository) {
        this.ticketRepository = ticketRepository;
    }

    public List<TicketResponse> getAllTickets(String status, String priority, String category) {
        List<Ticket> tickets;

        // Check which filter was provided and call the matching repository method
        if (hasText(status)) {
            tickets = ticketRepository.findByStatusIgnoreCase(status);
        } else if (hasText(priority)) {
            tickets = ticketRepository.findByPriorityIgnoreCase(priority);
        } else if (hasText(category)) {
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
        Ticket ticket = findTicketOrThrow(id);

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
        newTicket.setStatus("OPEN"); // Default status for new tickets (uppercase, matches filters/seeder)
        newTicket.setCreatedBy(request.getCreatedBy());
        newTicket.setCreatedAt(new java.util.Date().toString()); // Set the current date/time as a string

        // Save it to MongoDB! MongoDB will automatically generate the 'id'
        Ticket savedTicket = ticketRepository.save(newTicket);

        // Convert the saved entity back to a DTO for the response
        return mapToResponse(savedTicket);
    }

    public TicketResponse updateTicket(String id, UpdateTicketRequest request){
        logger.info("Updating ticket with id={}", id);

        Ticket ticket = findTicketOrThrow(id);

        // Clean the incoming values first, then check the ones that have allowed values.
        // The order matters: status is checked before priority, same as before the refactor.
        String title = normalizeRequired(request.getTitle());
        String status = normalizeStatus(request.getStatus());
        String priority = normalizePriority(request.getPriority());

        ensureTitleIsUniqueForUpdate(ticket, title);

        ticket.setTitle(title);
        ticket.setCategory(normalizeRequired(request.getCategory()));
        ticket.setDescription(normalizeRequired(request.getDescription()));
        ticket.setPriority(priority);
        ticket.setStatus(status);

        Ticket updatedTicket = ticketRepository.save(ticket);
        return mapToResponse(updatedTicket);
    }

    // ----- Private helper methods -----

    // Looks up one ticket, or stops the request with a 404 style error
    private Ticket findTicketOrThrow(String id) {
        return ticketRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Ticket " + id + " was not found"));
    }

    // True when a filter value was actually provided by the caller
    private boolean hasText(String value) {
        return value != null && !value.trim().isEmpty();
    }

    // Removes the spaces around a required text value
    private String normalizeRequired(String value) {
        return value == null ? null : value.trim();
    }

    // Cleans the status and makes sure it is one we allow
    private String normalizeStatus(String status) {
        String cleanStatus = normalizeRequired(status);

        if (!ALLOWED_STATUSES.contains(cleanStatus)) {
            throw new InvalidRequestException("Invalid status: " + cleanStatus + ". Allowed statuses are: " + ALLOWED_STATUSES);
        }

        return cleanStatus;
    }

    // Cleans the priority and makes sure it is one we allow
    private String normalizePriority(String priority) {
        String cleanPriority = normalizeRequired(priority);

        if (!ALLOWED_PRIORITIES.contains(cleanPriority)) {
            throw new InvalidRequestException("Invalid priority: " + cleanPriority + ". Allowed priorities are: " + ALLOWED_PRIORITIES);
        }

        return cleanPriority;
    }

    // A ticket may keep its own title, but it may not take a title another ticket already uses
    private void ensureTitleIsUniqueForUpdate(Ticket ticket, String title) {
        if (!ticket.getTitle().equalsIgnoreCase(title) && ticketRepository.existsByTitle(title)) {
            throw new DuplicateResourceException("Ticket title already exists: " + title);
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