package com.rollcallsystem.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.request.ClassObjDTO;
import com.rollcallsystem.repository.ClassObjRepository;
import com.rollcallsystem.service.ClassObjService;

@Service
public class ClassObjServiceImpl implements ClassObjService{

	@Autowired
	private ClassObjRepository classObjRepository;
	
	@Override
	public List<ClassObj> findAll() {
		return classObjRepository.findAll();
	}

	@Override
	public Boolean checkExists(ClassObjDTO classObjDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void save(ClassObjDTO classObjDTO) {
		ClassObj classObj = new ClassObj();
		classObj.setCode(classObjDTO.getCode());
		classObj.setName(classObjDTO.getName());
		classObj.setStartDate(classObjDTO.getStartDate());
		classObj.setEndDate(classObjDTO.getEndDate());
		classObj.setSemester(classObjDTO.getSemester());
		classObj.setSubject(classObjDTO.getSubject());
		
		classObjRepository.save(classObj);
	}

	@Override
	public void save(ClassObj classObj) {
		classObjRepository.save(classObj);
	}

	@Override
	public void update(ClassObjDTO classObjDTO) {
		ClassObj oldClassObj = classObjRepository.findById(classObjDTO.getCode()).get();
		ClassObj newClassObj = new ClassObj();
		newClassObj.setCode(oldClassObj.getCode());
		newClassObj.setName(classObjDTO.getName());
		newClassObj.setEndDate(classObjDTO.getEndDate());
		newClassObj.setStartDate(classObjDTO.getStartDate());
		newClassObj.setSemester(classObjDTO.getSemester());
		newClassObj.setSubject(classObjDTO.getSubject());
		newClassObj.setTeacher(oldClassObj.getTeacher());
		newClassObj.setStudents(oldClassObj.getStudents());
		
		classObjRepository.save(newClassObj);
	}

	@Override
	public ClassObjDTO getByCode(String code) {
		ClassObj classObj = classObjRepository.findById(code).get();
		ClassObjDTO classObjDTO = new ClassObjDTO();
		classObjDTO.setCode(classObj.getCode());
		classObjDTO.setName(classObj.getName());
		classObjDTO.setEndDate(classObj.getEndDate());
		classObjDTO.setStartDate(classObj.getStartDate());
		
		return classObjDTO;
	}

	@Override
	public void delete(String code) {
		classObjRepository.deleteById(code);
	}

	@Override
	public ClassObj findByCode(String code) {
		return classObjRepository.findById(code).get();
	}

	@Override
	public List<ClassObj> findByTeacher(Teacher teacher) {
		ClassObj classObjExample = new ClassObj();
		classObjExample.setTeacher(teacher);
		Example<ClassObj> example = Example.of(classObjExample, ExampleMatcher.matchingAll());
		List<ClassObj> classList = classObjRepository.findAll(example);
		return classList;
	}
}
