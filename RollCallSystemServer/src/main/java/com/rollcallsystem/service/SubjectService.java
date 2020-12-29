package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.Subject;
import com.rollcallsystem.model.request.SubjectDTO;

public interface SubjectService {
	List<Subject> findAll();
	void save(SubjectDTO subject);
	void delete(SubjectDTO subject);
	Boolean checkExists(SubjectDTO subject);
}
