package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;
import java.util.List;

public class SearchPractice {
    
    public static void main(String[] args) {
       
        CourseRepository courseRepository = new InMemoryCourseRepository();
        CourseService courseService = new CourseService(courseRepository);

        //add these 4 course
        // C001 - Java Fundamentals - Beginner
        // C002 - React Frontend Development - Intermediate
        // C003 - MongoDB Basics - Beginner
        // C004 - Spring Boot API Development - Intermediate

        Course course1 = new Course("C001", "Java Fundamentals", 10,"Beginner");
        Course course2 = new Course("C002", "React Frontend Development", 10,"Intermediate");
        Course course3 = new Course("C003", "MongoDB Basics", 10,"Beginner");
        Course course4 = new Course("C004", "Spring Boot API Development", 10,"Intermediate");

        List<Course> courses = List.of(course1, course2, course3, course4);
        for (Course course : courses) {
            courseService.createCourse(course);
        }

        List<Course> beginnerCourses = courseService.searchByLevelUsingLoop("Beginner");

        System.out.println("Beginner Courses:");
        for (Course course : beginnerCourses) {
            System.out.println(course.getCourseId() + " - " + course.getTitle());
        }


    }
}
