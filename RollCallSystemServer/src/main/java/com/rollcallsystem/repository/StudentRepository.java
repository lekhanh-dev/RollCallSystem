package com.rollcallsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rollcallsystem.model.Student;

public interface StudentRepository extends JpaRepository<Student, String>{

}
