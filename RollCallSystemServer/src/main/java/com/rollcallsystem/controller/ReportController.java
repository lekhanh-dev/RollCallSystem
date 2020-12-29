package com.rollcallsystem.controller;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.RollCallListForClass;
import com.rollcallsystem.model.RollCallListForStudent;
import com.rollcallsystem.model.Student;
import com.rollcallsystem.service.ClassObjService;
import com.rollcallsystem.util.ExcelGenerator;

@RestController
public class ReportController {
	
	@Autowired
	private ClassObjService classObjService;
	
	public List<HashMap<String, Object>> getStudentMap(String classCode) {
		
		List<HashMap<String, Object>> studentMap = new ArrayList<HashMap<String, Object>>();
		
		ClassObj classObj = classObjService.findByCode(classCode);
		
		List<RollCallListForClass> rollCallListForClassList = classObj.getRollCallListForClass();
		if(rollCallListForClassList.size() == 0) {
			return studentMap;
		}
		
		List<Student> studentList = classObj.getStudents();
		
 		for (Student student : studentList) {
 			List<HashMap<String, Object>> dataMap = new ArrayList<HashMap<String, Object>>();
 			for (RollCallListForClass rollCallListForClass : rollCallListForClassList) {
 				List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass.getRollCallListForStudent();
 				for (RollCallListForStudent rollCallListForStudent: rollCallListForStudentList) {
 					if(student.getCode().equals(rollCallListForStudent.getStudentCode())) {
 						HashMap<String, Object> map = new HashMap<String, Object>();
 						map.put("date",rollCallListForClass.getDate().toString());
 						map.put("status", rollCallListForStudent.getStatus());
 						dataMap.add(map);
 						break;
 					}
 					
 				}
  			}
 			HashMap<String, Object> map2 = new HashMap<String, Object>();
 			map2.put("code", student.getCode());
 			map2.put("name", student.getName());
 			map2.put("history", dataMap);
 			studentMap.add(map2);
		}
 		
 		return studentMap;
	}
	
	@GetMapping("/get-detail-student-in-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getDetailStudentInClass(@PathVariable("classCode") String classCode) {
		
		List<HashMap<String, Object>> studentMap = getStudentMap(classCode);
		return new ResponseEntity<>(studentMap, HttpStatus.OK);
	}
	
	@PostMapping("/export-file-excel/{classCode}/data.xlsx")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public void downloadFile(HttpServletResponse response, @PathVariable("classCode") String classCode) throws IOException {
		ClassObj classObj = classObjService.findByCode(classCode);
		
		List<HashMap<String, Object>> studentMap = getStudentMap(classCode);
		
		InputStream in = ExcelGenerator.dataToExcel(studentMap, classObj.getName());

		response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + classObj.getName() + ".xlsx");

		BufferedInputStream inStream = new BufferedInputStream(in);
		BufferedOutputStream outStream = new BufferedOutputStream(response.getOutputStream());

		byte[] buffer = new byte[1024];
		int bytesRead = 0;
		while ((bytesRead = inStream.read(buffer)) != -1) {
			outStream.write(buffer, 0, bytesRead);
		}
		outStream.flush();
		inStream.close();
	}
}
