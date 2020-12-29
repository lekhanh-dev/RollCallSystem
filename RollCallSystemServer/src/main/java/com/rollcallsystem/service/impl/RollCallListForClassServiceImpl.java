package com.rollcallsystem.service.impl;

import java.sql.Date;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.RollCallListForClass;
import com.rollcallsystem.repository.RollCallListForClassRepository;
import com.rollcallsystem.service.RollCallListForClassService;

@Service
public class RollCallListForClassServiceImpl implements RollCallListForClassService{

	@Autowired
	private RollCallListForClassRepository rollCallListForClassRepository;
	
	@Override
	public void save(RollCallListForClass rollCallListForClass) {
		rollCallListForClassRepository.save(rollCallListForClass);
	}

	@Override
	public RollCallListForClass findByExmaple(Date date, ClassObj classObj) {
		RollCallListForClass rollCallListForClassExample = new RollCallListForClass();
		rollCallListForClassExample.setDate(date);
		rollCallListForClassExample.setClassObj(classObj);
		Example<RollCallListForClass> example = Example.of(rollCallListForClassExample, ExampleMatcher.matchingAll());
		List<RollCallListForClass> rollCallListForClassList = rollCallListForClassRepository.findAll(example);
		if(rollCallListForClassList.get(0) != null) {
			return rollCallListForClassList.get(0);
		} else {
			return null;
		}
	}
}
