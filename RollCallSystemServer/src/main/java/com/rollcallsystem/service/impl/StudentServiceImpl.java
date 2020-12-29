package com.rollcallsystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.Student;
import com.rollcallsystem.model.request.StudentDTO;
import com.rollcallsystem.repository.StudentRepository;
import com.rollcallsystem.service.StudentService;

@Service
public class StudentServiceImpl implements StudentService{

	@Autowired
	private StudentRepository studentRepository;
	
	@Override
	public List<Student> findAll() {
		return studentRepository.findAll();
	}

	@Override
	public Boolean checkExists(StudentDTO student) {
		return studentRepository.existsById(student.getCode());
	}

	@Override
	public void save(StudentDTO student) {
		Student studentEntity = new Student();
		studentEntity.setCode(student.getCode());
		studentEntity.setName(student.getName());
		studentRepository.save(studentEntity);
	}

	@Override
	public void update(StudentDTO student) {
		Student oldStudent = studentRepository.findById(student.getCode()).get();
		Student studentEntity = new Student();
		studentEntity.setCode(student.getCode());
		studentEntity.setName(student.getName());
		studentEntity.setImageList(oldStudent.getImageList());
		studentEntity.setUser_id(oldStudent.getUser_id());
		studentRepository.save(studentEntity);
	}

	@Override
	public Student getById(String id) {
		return studentRepository.findById(id).get();
	}

	@Override
	public void delete(String code) {
		studentRepository.deleteById(code);
	}

	@Override
	public void save(Student student) {
		studentRepository.save(student);
	}
}
