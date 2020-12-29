package com.rollcallsystem.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.RollCallListForStudent;
import com.rollcallsystem.repository.RollCallListForStudentRepository;
import com.rollcallsystem.service.RollCallListForStudentService;

@Service
public class RollCallListForStudentServiceImpl implements RollCallListForStudentService{

	@Autowired
	private RollCallListForStudentRepository rollCallListForStudentRepository;
	
	@Override
	public void save(RollCallListForStudent rollCallListForStudent) {
		rollCallListForStudentRepository.save(rollCallListForStudent);
	}

}
