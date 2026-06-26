package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.model.CourseOffering;
import com.fullstack.demo.model.Instructor;

public class ObjectRelationshipPractice {
    
    public static void main(String[] args) {
        // Create an instructor
        Instructor instructor = new Instructor("I001", "Mike Rahman", "Java and Spring Boot");
        Instructor instructor2 = new Instructor("I002", "Marcus Lee", "React and Frontend Development");

        Course course1 = new Course("C001", "Java Fundamentals", 14, "Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 21, "Intermediate");

        course1.setInstructor(instructor);
        course2.setInstructor(instructor2);

        course1.printSummary();
        course2.printSummary();

        //? CourseOffering uses composition because it has a Course and has an Instructor.

        // OFF001 - Java Fundamentals June Intake
        // Course: Java Fundamentals
        // Instructor: Mike Rahman
        // Start Date: 2026-06-29
        // End Date: 2026-06-30
        // Capacity: 25
        // Delivery Mode: Physical
        CourseOffering courseOffering1 = new CourseOffering("OFF001", "Java Fundamentals June Intake", course1, instructor, "2026-06-29", "2026-06-30", 25, "Physical");



        // OFF002 - React Frontend July Intake
        // Course: React Frontend Development
        // Instructor: Marcus Lee
        // Start Date: 2026-07-01
        // End Date: 2026-07-03
        // Capacity: 20
        // Delivery Mode: Hybrid
        CourseOffering courseOffering2 = new CourseOffering("OFF002", "React Frontend Development July Intake", course2, instructor2, "2026-07-01", "2026-07-03", 20, "Hybrid");

        courseOffering1.printSummary();
        courseOffering2.printSummary();

    }

}
