package com.example.supportdesk.config;

import com.example.supportdesk.model.Ticket;
import com.example.supportdesk.repository.TicketRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;

@Configuration
public class TicketDataSeeder {

    private static final Logger logger = LoggerFactory.getLogger(TicketDataSeeder.class);

    @Bean
    CommandLineRunner seedTickets(TicketRepository ticketRepository) {
        return args -> {
            // Only seed when the collection is empty so we don't create duplicates on every restart
            if (ticketRepository.count() > 0) {
                logger.info("Tickets already exist ({}). Skipping seed.", ticketRepository.count());
                return;
            }

            createTicket(ticketRepository, "Cannot access email", "User is locked out of their inbox after a password change.", "Email", "HIGH", "OPEN");
            createTicket(ticketRepository, "Laptop will not power on", "Company laptop shows no lights when the power button is pressed.", "Hardware", "HIGH", "OPEN");
            createTicket(ticketRepository, "VPN keeps disconnecting", "Remote worker drops off the VPN every few minutes.", "Network", "MEDIUM", "IN_PROGRESS");
            createTicket(ticketRepository, "Request access to shared drive", "New hire needs read access to the Finance shared drive.", "Access", "LOW", "OPEN");
            createTicket(ticketRepository, "Password reset not working", "Self-service password reset returns an error page.", "Account", "HIGH", "IN_PROGRESS");
            createTicket(ticketRepository, "Printer on 3rd floor jamming", "The shared printer jams on every second page.", "Hardware", "LOW", "CLOSED");

            logger.info("Seeded {} sample tickets.", ticketRepository.count());
        };
    }

    private void createTicket(
            TicketRepository ticketRepository,
            String title,
            String description,
            String category,
            String priority,
            String status) {

        Ticket ticket = new Ticket();
        ticket.setTitle(title);
        ticket.setDescription(description);
        ticket.setCategory(category);
        ticket.setPriority(priority);
        ticket.setStatus(status);
        ticket.setCreatedBy("admin@example.com");
        ticket.setCreatedAt(LocalDate.now().toString());

        ticketRepository.save(ticket);
    }
}
