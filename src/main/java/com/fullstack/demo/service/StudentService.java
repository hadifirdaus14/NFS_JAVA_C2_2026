package com.fullstack.demo.service;

import java.util.List;

import com.fullstack.demo.exception.StudentNotFoundException;
import com.fullstack.demo.model.Student;
import com.fullstack.demo.repository.StudentRepository;

public class StudentService {
    
    private final StudentRepository studentRepository;
    
    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Student registerStudent(Student student) {
        if (studentRepository.existsById(student.getStudentId())) {
            throw new IllegalArgumentException("Student already exists: " + student.getStudentId());
        }

        return studentRepository.save(student);
    }

    public Student getStudentById(String studentId){
        return studentRepository.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Student> searchByNameUsingLoop(String keyword){
        String safeKeyword = keyword == null ? "" : keyword.trim().toLowerCase();
        List<Student> results = new java.util.ArrayList<>();

        for (Student student : studentRepository.findAll()) {
            if (student.getStudentName().toLowerCase().contains(safeKeyword)) {
                results.add(student);
            }
        }

        return results;
    }

}
