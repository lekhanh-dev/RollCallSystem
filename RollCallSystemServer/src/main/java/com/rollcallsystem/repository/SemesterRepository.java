package com.rollcallsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rollcallsystem.model.Semester;

public interface SemesterRepository extends JpaRepository<Semester, String>{

}
