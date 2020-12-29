package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.Schedule;
import com.rollcallsystem.model.request.ScheduleDTO;

public interface ScheduleService {
	List<Schedule> findAll();
	Boolean checkExists(ScheduleDTO scheduleDTO);
	void save(ScheduleDTO scheduleDTO);
	void save(Schedule schedule);
	void update(ScheduleDTO scheduleDTO);
	ScheduleDTO getById(Long id);
	Schedule findById(Long id);
	void delete(Long id);
	ScheduleDTO findByClass(ClassObj classObj);
}
