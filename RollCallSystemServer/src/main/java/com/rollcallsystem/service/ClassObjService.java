package com.rollcallsystem.service;

import java.util.List;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.request.ClassObjDTO;

public interface ClassObjService {
	List<ClassObj> findAll();
	Boolean checkExists(ClassObjDTO classObjDTO);
	void save(ClassObjDTO classObjDTO);
	void save(ClassObj classObj);
	void update(ClassObjDTO classObjDTO);
	ClassObjDTO getByCode(String code);
	ClassObj findByCode(String code);
	void delete(String code);
	List<ClassObj> findByTeacher(Teacher teacher);
}
