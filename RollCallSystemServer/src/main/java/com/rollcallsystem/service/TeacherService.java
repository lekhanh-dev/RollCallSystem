package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.request.TeacherDTO;

public interface TeacherService {
	List<Teacher> findAll();
	Boolean checkExists(TeacherDTO teacher);
	void save(TeacherDTO teacher);
	void update(TeacherDTO teacher);
	Teacher getById(String id);
	void delete(String code);
}
