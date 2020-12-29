package com.rollcallsystem.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.Subject;
import com.rollcallsystem.model.request.SubjectDTO;
import com.rollcallsystem.repository.SubjectRepository;
import com.rollcallsystem.service.SubjectService;

@Service
public class SubjectSeviceImpl implements SubjectService{
	
	@Autowired
	private SubjectRepository subjectRepository;

	@Override
	public List<Subject> findAll() {
		List<Subject> results = new ArrayList<>();
		results = subjectRepository.findAll();
		return results;
	}

	@Override
	public void save(SubjectDTO subject) {
		Subject subjectEntity = new Subject();
		subjectEntity.setCode(subject.getCode());
		subjectEntity.setSubjectName(subject.getName());
		
		subjectRepository.save(subjectEntity);
	}

	@Override
	public Boolean checkExists(SubjectDTO subject) {
		return subjectRepository.existsById(subject.getCode());
	}

	@Override
	public void delete(SubjectDTO subject) {
		subjectRepository.deleteById(subject.getCode());
	}

}
