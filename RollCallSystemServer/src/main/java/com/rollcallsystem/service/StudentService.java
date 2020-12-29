package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.Student;
import com.rollcallsystem.model.request.StudentDTO;

public interface StudentService {
	List<Student> findAll();
	Boolean checkExists(StudentDTO student);
	void save(StudentDTO student);
	void save(Student student);
	void update(StudentDTO student);
	Student getById(String id);
	void delete(String code);
}
