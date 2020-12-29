package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.Semester;
import com.rollcallsystem.model.request.SemesterDTO;

public interface SemesterService {
	List<Semester> findAll();
	void save(SemesterDTO semester);
	void delete(SemesterDTO semester);
	Boolean checkExists(SemesterDTO semester);
	
}
