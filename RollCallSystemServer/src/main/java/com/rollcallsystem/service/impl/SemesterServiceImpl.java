package com.rollcallsystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.Semester;
import com.rollcallsystem.model.request.SemesterDTO;
import com.rollcallsystem.repository.SemesterRepository;
import com.rollcallsystem.service.SemesterService;

@Service
public class SemesterServiceImpl implements SemesterService{

	@Autowired
	private SemesterRepository semesterRepository;
	
	@Override
	public List<Semester> findAll() {
		return semesterRepository.findAll();
	}

	@Override
	public void save(SemesterDTO semester) {
		Semester semesterEntity = new Semester();
		semesterEntity.setCode(semester.getCode());
		semesterEntity.setSemesterName(semester.getSemesterName());
		semesterEntity.setStartDate(semester.getStartDate());
		semesterEntity.setEndDate(semester.getEndDate());
		
		semesterRepository.save(semesterEntity);
	}

	@Override
	public void delete(SemesterDTO semester) {
		semesterRepository.deleteById(semester.getCode());
	}

	@Override
	public Boolean checkExists(SemesterDTO semester) {
		return semesterRepository.existsById(semester.getCode());
	}

}
