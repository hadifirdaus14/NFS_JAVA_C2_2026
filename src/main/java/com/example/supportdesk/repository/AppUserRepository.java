package com.example.supportdesk.repository;

import com.example.supportdesk.model.AppUser;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends MongoRepository<AppUser, String> {
    
    // Finds a user by their email, ignoring uppercase/lowercase differences
    Optional<AppUser> findByEmailIgnoreCase(String email);
    
    // Returns true if the email is already in the database, useful for registration validation
    boolean existsByEmailIgnoreCase(String email);
    
}