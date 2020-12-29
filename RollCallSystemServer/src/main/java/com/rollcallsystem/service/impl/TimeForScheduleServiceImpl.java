package com.rollcallsystem.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.TimeForSchedule;
import com.rollcallsystem.repository.TimeForScheduleRepository;
import com.rollcallsystem.service.TimeForScheduleService;

@Service
public class TimeForScheduleServiceImpl implements TimeForScheduleService{
	
	@Autowired
	private TimeForScheduleRepository timeForScheduleRepository;

	@Override
	public TimeForSchedule getByName(Long name) {
		return timeForScheduleRepository.findById(name).get();
	}

}
