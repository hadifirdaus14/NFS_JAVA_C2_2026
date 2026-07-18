package com.example.supportdesk.dto;

public class AuthResponse {
    private String token;
    private String message;
    private long expiresInMinutes;
    private String userId;
    private String name;
    private String email;
    private String role;

    public AuthResponse(String token, String message, long expiresInMinutes, String userId, String name, String email, String role) {
        this.token = token;
        this.message = message;
        this.expiresInMinutes = expiresInMinutes;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    // Getters
    public String getToken() { return token; }
    
    public String getMessage() { return message; }
    
    public long getExpiresInMinutes() { return expiresInMinutes; }
    
    public String getUserId() { return userId; }
    
    public String getName() { return name; }
    
    public String getEmail() { return email; }
    
    public String getRole() { return role; }
    
}