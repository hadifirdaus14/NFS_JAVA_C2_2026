package com.example.supportdesk.service;

import java.util.List;

import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.stereotype.Service;

import com.example.supportdesk.dto.ReportCountResponse;

@Service
public class TicketReportService {

    private final MongoTemplate mongoTemplate;

    public TicketReportService(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public List<ReportCountResponse> getTicketsByStatus() {
        // 1. Define the aggregation pipeline
        Aggregation aggregation = Aggregation.newAggregation(
                // Group by the "status" field in your ticket document and count them
                Aggregation.group("status").count().as("count"),
                
                // Rename the resulting grouping key (which MongoDB defaults to "_id") to "label" 
                // so it matches your ReportCountResponse DTO perfectly
                Aggregation.project("count").and("_id").as("label")
        );

        // 2. Execute the aggregation against the "tickets" collection
        AggregationResults<ReportCountResponse> results = mongoTemplate.aggregate(
                aggregation, 
                "tickets", 
                ReportCountResponse.class
        );

        // 3. Return the mapped results
        return results.getMappedResults();
    }

    public List<ReportCountResponse> countTicketsByPriority() {
        // 1. Define the aggregation pipeline
        Aggregation aggregation = Aggregation.newAggregation(
                // Group by the "priority" field and count them
                Aggregation.group("priority").count().as("count"),
                
                // Rename "_id" to "label" to match the ReportCountResponse DTO
                Aggregation.project("count").and("_id").as("label")
        );

        // 2. Execute the aggregation against the "tickets" collection
        AggregationResults<ReportCountResponse> results = mongoTemplate.aggregate(
                aggregation, 
                "tickets", 
                ReportCountResponse.class
        );

        return results.getMappedResults();
    }

}