package com.rollcallsystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rollcallsystem.model.MessageResponse;
import com.rollcallsystem.model.Semester;
import com.rollcallsystem.model.request.SemesterDTO;
import com.rollcallsystem.service.SemesterService;

@RestController
public class SemesterController {
	
	@Autowired
	private SemesterService semesterService;

	@GetMapping("/semesters")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getAllSemester() {
		List<Semester> semesters = semesterService.findAll();
		List<HashMap<String, Object>> listSemester = new ArrayList<HashMap<String, Object>>();
		for (Semester semester : semesters) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", semester.getCode());
			map.put("semesterName", semester.getSemesterName());
			map.put("startDate", semester.getStartDate());
			map.put("endDate", semester.getEndDate());
			listSemester.add(map);
		}
		return new ResponseEntity<>(listSemester, HttpStatus.OK);
	}

	@PostMapping("/semesters")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createNewSemester(@RequestBody SemesterDTO semester) {
		// Validate
		String code = semester.getCode();
		String name = semester.getSemesterName();
		Boolean checkExists = semesterService.checkExists(semester);
		if (code.length() > 15) {
			return new ResponseEntity<>(new MessageResponse("Mã học kỳ không được vượt quá 15 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (name.length() > 200) {
			return new ResponseEntity<>(new MessageResponse("Tên học kỳ không được vượt quá 200 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (checkExists) {
			return new ResponseEntity<>(new MessageResponse("Thất bại! Mã học kỳ đã tồn tại", true), HttpStatus.BAD_REQUEST);
		} else {
			semesterService.save(semester);
			return new ResponseEntity<>(new MessageResponse("Thêm học kỳ mới thành công", false), HttpStatus.OK);
		}
	}

	@PutMapping("/semesters")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> updateSemester(@RequestBody SemesterDTO semester) {
		// Validate
		String name = semester.getSemesterName();
		Boolean checkExists = semesterService.checkExists(semester);
		if (checkExists) {
			if (name.length() > 200) {
				return new ResponseEntity<>(new MessageResponse("Tên học kỳ không được vượt quá 200 kí tự", true),
						HttpStatus.BAD_REQUEST);
			} else {
				semesterService.save(semester);
				return new ResponseEntity<>(new MessageResponse("Cập nhập học kỳ thành công", false), HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã học kỳ chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/semesters")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> deleteSemester(@RequestBody SemesterDTO semester) {
		Boolean checkExists = semesterService.checkExists(semester);
		if (checkExists) {
			semesterService.delete(semester);
			return new ResponseEntity<>(new MessageResponse("Xóa học kỳ thành công", false), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã học kỳ chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}
}
