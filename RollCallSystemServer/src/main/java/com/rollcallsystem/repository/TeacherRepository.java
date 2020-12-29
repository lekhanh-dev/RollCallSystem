package com.rollcallsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rollcallsystem.model.Teacher;

public interface TeacherRepository extends JpaRepository<Teacher, String>{
	
}
