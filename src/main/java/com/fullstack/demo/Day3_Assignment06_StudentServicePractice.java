package com.fullstack.demo;

import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.InMemoryStudentRepository;
import com.fullstack.demo.repository.StudentRepository;
import com.fullstack.demo.service.StudentService;

public class Day3_Assignment06_StudentServicePractice {
    
    public static void main(String[] args) {
        
        StudentRepository studentRepository = new InMemoryStudentRepository();
        StudentService studentService = new StudentService(studentRepository);

        studentService.registerStudent(new Student("S001", "Alice Johnson", "alice@example.com"));
        studentService.registerStudent(new Student("S002", "Bob Smith", "bob@example.com"));
        studentService.registerStudent(new Student("S003", "Charlie Brown", "charlie@example.com"));

        System.out.println("All Students:");
        for (Student student : studentRepository.findAll()) {
            student.printProfile();
        }

        System.out.println("Searching for students with Id 'S002':");
        Student student1 = studentService.getStudentById("S002");
        student1.printProfile();

        System.out.println("Searching for students with name containing 'Alice':");
        for (Student student : studentService.searchByNameUsingLoop("Alice")) {
            student.printProfile();
        }

        System.out.println("Attempting to find student with ID 'S999':");
        try {
            Student studentErr = studentService.getStudentById("S999");
            studentErr.printProfile();
        } catch (StudentNotFoundException e) {
            System.out.println(e.getMessage());
        }



    }
}
