package com.rollcallsystem.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.request.TeacherDTO;
import com.rollcallsystem.repository.TeacherRepository;
import com.rollcallsystem.service.TeacherService;

@Service
public class TeacherServiceImpl implements TeacherService{

	@Autowired
	private TeacherRepository teacherRepository;

	@Override
	public List<Teacher> findAll() {
		return teacherRepository.findAll();
	}

	@Override
	public Boolean checkExists(TeacherDTO teacher) {
		return teacherRepository.existsById(teacher.getCode());
	}

	@Override
	public void save(TeacherDTO teacher) {
		Teacher teacherEntity = new Teacher();
		teacherEntity.setCode(teacher.getCode());
		teacherEntity.setName(teacher.getName());
		teacherRepository.save(teacherEntity);
	}

	@Override
	public void update(TeacherDTO teacher) {
		Optional<Teacher> oldTeacher = teacherRepository.findById(teacher.getCode());
		Teacher teacherEntity = new Teacher();
		teacherEntity.setCode(teacher.getCode());
		teacherEntity.setName(teacher.getName());
		teacherEntity.setUser(oldTeacher.get().getUser());
		teacherRepository.save(teacherEntity);
	}

	@Override
	public Teacher getById(String id) {
		return teacherRepository.findById(id).get();
	}

	@Override
	public void delete(String code) {
		teacherRepository.deleteById(code);
	}
	
	
}
