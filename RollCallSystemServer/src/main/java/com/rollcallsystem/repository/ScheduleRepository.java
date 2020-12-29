package com.rollcallsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rollcallsystem.model.Schedule;

public interface ScheduleRepository extends JpaRepository<Schedule, Long>{

}
