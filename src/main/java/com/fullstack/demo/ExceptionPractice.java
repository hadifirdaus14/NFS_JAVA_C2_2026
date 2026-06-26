package com.fullstack.demo;

import com.fullstack.demo.exception.CourseNotFoundException;
import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class ExceptionPractice {
    
    public static void main(String[] args) {
        
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        Course course1 = new Course("C001", "Java Fundamentals", 5, "Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 10, "Beginner");

        courseService.createCourse(course1);
        courseService.createCourse(course2);

        Course course = courseService.getCourseById("C001");
        course.printSummary();

        
        try {
            Course missingCourse = courseService.getCourseById("C999");
            missingCourse.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Friendly message for user: " + e.getMessage());
        }

        
        try {
            Course errCourse = courseService.getCourseById("C888");
            errCourse.printSummary();
        } catch (CourseNotFoundException e) {
            System.out.println("Cannot display course: " + e.getMessage());
        }
    }
}
