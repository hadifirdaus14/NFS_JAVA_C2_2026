// You will create a new demo class and write code that:

// 1. Creates a repository.
// 2. Creates a service.
// 3. Adds a new course using the service.
// 4. Retrieves the same course using the service.
// 5. Prints the result.
// 6. Writes comments explaining the flow.

package com.fullstack.demo;

import com.fullstack.demo.model.Course;
import com.fullstack.demo.repository.CourseRepository;
import com.fullstack.demo.repository.InMemoryCourseRepository;
import com.fullstack.demo.service.CourseService;

public class CodeFlowService {

    public static void main(String[] args) {
        // Step 1: Create a repository instance
        CourseRepository courseRepository = new InMemoryCourseRepository();

        // Step 2: Create a service instance and pass the repository to it
        CourseService courseService = new CourseService(courseRepository);

        // Step 3: Add a new course using the service
        Course newCourse = new Course("CS101", "Introduction to Computer Science");
        courseService.addCourse(newCourse);

        // Step 4: Retrieve the same course using the service
        Course retrievedCourse = courseService.getCourseById("CS101");

        // Step 5: Print the result
        if (retrievedCourse != null) {
            System.out.println("Retrieved Course: " + retrievedCourse.getId() + " - " + retrievedCourse.getName());
        } else {
            System.out.println("Course not found.");
        }
    }
}