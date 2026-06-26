package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import java.util.List;
import java.util.Optional;

public class RepositoryPractice {
    
    public static void main(String[] args) {

        //The variable type is CourseRepository, but the actual object is InMemoryCourseRepository.
        CourseRepository courseRepository = new InMemoryCourseRepository();

        Course course1 = new Course("C005", "API Documentation", 7, "Beginner");
        courseRepository.save(course1);

        Course course2 = new Course("C006", "Java Collections Practice", 12, "Beginner");
        courseRepository.save(course2);

        Course course3 = new Course("C007", "Clean Code Basics", 8, "Intermediate");
        courseRepository.save(course3);

        List<Course> courses = courseRepository.findAll();
        for (Course course : courses) {
        course.printSummary();
        }

        Optional<Course> optionalCourse = courseRepository.findById("C006");

        if (optionalCourse.isPresent()) {
        Course foundCourse = optionalCourse.get();
        foundCourse.printSummary();
        } else {
            System.out.println("Course not found.");
        }

        System.out.println("C007 exists: " + courseRepository.existsById("C007"));
        }

}
