package com.rollcallsystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.Schedule;
import com.rollcallsystem.model.request.ScheduleDTO;
import com.rollcallsystem.repository.ScheduleRepository;
import com.rollcallsystem.service.ScheduleService;

@Service
public class ScheduleServiceImpl implements ScheduleService{

	@Autowired
	private ScheduleRepository scheduleRepository;
	
	@Override
	public List<Schedule> findAll() {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Boolean checkExists(ScheduleDTO scheduleDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(ScheduleDTO scheduleDTO) {
		Schedule schedule = new Schedule();
		schedule.setFriday(scheduleDTO.getFriday());
		schedule.setMonday(scheduleDTO.getMonday());
		schedule.setSaturday(scheduleDTO.getSaturday());
		schedule.setSunday(scheduleDTO.getSunday());
		schedule.setThursday(scheduleDTO.getThursday());
		schedule.setTuesday(scheduleDTO.getThursday());
		schedule.setWednesday(scheduleDTO.getWednesday());
		schedule.setClassCode(scheduleDTO.getClassCode());
		
		scheduleRepository.save(schedule);
	}

	@Override
	public void save(Schedule schedule) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void update(ScheduleDTO scheduleDTO) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public ScheduleDTO getById(Long id) {
		return null;
	}

	@Override
	public void delete(Long id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public ScheduleDTO findByClass(ClassObj classObj) {
		Schedule scheduleExample = new Schedule();
		scheduleExample.setClassCode(classObj.getCode());
		Example<Schedule> example = Example.of(scheduleExample, ExampleMatcher.matchingAll());
		List<Schedule> schedules = scheduleRepository.findAll(example);
		ScheduleDTO scheduleDTO = new ScheduleDTO();
		for (Schedule schedule : schedules) {
			scheduleDTO.setId(schedule.getId());
			scheduleDTO.setFriday(schedule.getFriday());
			scheduleDTO.setMonday(schedule.getMonday());
			scheduleDTO.setSaturday(schedule.getSaturday());
			scheduleDTO.setSunday(schedule.getSunday());
			scheduleDTO.setThursday(schedule.getThursday());
			scheduleDTO.setTuesday(schedule.getThursday());
			scheduleDTO.setWednesday(schedule.getWednesday());
		}
		return scheduleDTO;
	}

	@Override
	public Schedule findById(Long id) {
		return scheduleRepository.findById(id).get();
	}

}
