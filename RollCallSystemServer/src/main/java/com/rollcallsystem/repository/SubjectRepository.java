package com.rollcallsystem.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.rollcallsystem.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, String>{

}
