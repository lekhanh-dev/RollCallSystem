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
import com.rollcallsystem.model.Subject;
import com.rollcallsystem.model.request.SubjectDTO;
import com.rollcallsystem.service.SubjectService;

@RestController
public class SubjectController {

	@Autowired
	private SubjectService subjectService;

	@GetMapping("/subjects")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getAllSubject() {
		List<Subject> subjects = subjectService.findAll();
		List<HashMap<String, Object>> listSubject = new ArrayList<HashMap<String, Object>>();
		for (Subject subject : subjects) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", subject.getCode());
			map.put("name", subject.getSubjectName());
			listSubject.add(map);
		}
		return new ResponseEntity<>(listSubject, HttpStatus.OK);
	}

	@PostMapping("/subjects")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createNewSubject(@RequestBody SubjectDTO subject) {
		// Validate
		String code = subject.getCode();
		String name = subject.getName();
		Boolean checkExists = subjectService.checkExists(subject);
		if (code.length() > 10) {
			return new ResponseEntity<>(new MessageResponse("Mã môn học không được vượt quá 10 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (name.length() > 200) {
			return new ResponseEntity<>(new MessageResponse("Tên môn học không được vượt quá 200 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (checkExists) {
			return new ResponseEntity<>(new MessageResponse("Thất bại! Mã môn học đã tồn tại", true), HttpStatus.BAD_REQUEST);
		} else {
			subjectService.save(subject);
			return new ResponseEntity<>(new MessageResponse("Thêm môn học mới thành công", false), HttpStatus.OK);
		}
	}

	@PutMapping("/subjects")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> updateSubject(@RequestBody SubjectDTO subject) {
		// Validate
		String name = subject.getName();
		Boolean checkExists = subjectService.checkExists(subject);
		if (checkExists) {
			if (name.length() > 200) {
				return new ResponseEntity<>(new MessageResponse("Tên môn học không được vượt quá 200 kí tự", true),
						HttpStatus.BAD_REQUEST);
			} else {
				subjectService.save(subject);
				return new ResponseEntity<>(new MessageResponse("Cập nhập môn học thành công", false), HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã môn học chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}

	@DeleteMapping("/subjects")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> deleteSubject(@RequestBody SubjectDTO subject) {
		Boolean checkExists = subjectService.checkExists(subject);
		if (checkExists) {
			subjectService.delete(subject);
			return new ResponseEntity<>(new MessageResponse("Xóa môn học thành công", false), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã môn học chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}
}
