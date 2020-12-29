package com.rollcallsystem.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rollcallsystem.model.MessageResponse;
import com.rollcallsystem.model.Role;
import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.User;
import com.rollcallsystem.model.request.TeacherDTO;
import com.rollcallsystem.model.request.UserDTO;
import com.rollcallsystem.service.RoleService;
import com.rollcallsystem.service.TeacherService;
import com.rollcallsystem.service.UserService;

@RestController
public class TeacherController {

	@Autowired
	private TeacherService teacherService;

	@Autowired
	private UserService userService;

	@Autowired
	private RoleService roleService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@GetMapping("/teachers")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getAllTeacher() {
		List<Teacher> teachers = teacherService.findAll();
		List<HashMap<String, Object>> teacherList = new ArrayList<HashMap<String, Object>>();
		for (Teacher teacher : teachers) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", teacher.getCode());
			map.put("name", teacher.getName());
			if (teacher.getUser() != null) {
				map.put("username", teacher.getUser().getUsername());
			} else {
				map.put("username", null);
			}
			teacherList.add(map);
		}
		return new ResponseEntity<>(teacherList, HttpStatus.OK);
	}
	
	@GetMapping("/teacher-by-username/{username}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER', 'ROLE_ADMIN')")
	public ResponseEntity<?> getTeacherByUsername(@PathVariable("username") String username) {
		User user =  userService.findByUsername(username);
		Teacher teacher = new Teacher();
		List<Teacher> teacherList = teacherService.findAll();
		for (Teacher teacher2 : teacherList) {
			if(teacher2.getUser() != null) {
				if(teacher2.getUser().equals(user)) {
					teacher = teacher2;
				}
			}
		}
		
		HashMap<String, Object> teacherDTO = new HashMap<String, Object>();
		teacherDTO.put("code", teacher.getCode());
		teacherDTO.put("name", teacher.getName());
		teacherDTO.put("userId", teacher.getUser().getId());
		teacherDTO.put("username", teacher.getUser().getUsername());

		return new ResponseEntity<>(teacherDTO, HttpStatus.OK);
	}

	@PostMapping("/teachers")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createTeacher(@RequestBody TeacherDTO teacher) {
		// Validate
		String code = teacher.getCode();
		String name = teacher.getName();
		Boolean checkExists = teacherService.checkExists(teacher);
		if (code.length() > 10) {
			return new ResponseEntity<>(new MessageResponse("Mã giáo viên không được vượt quá 10 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (name.length() > 50) {
			return new ResponseEntity<>(new MessageResponse("Tên giáo viên không được vượt quá 50 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (checkExists) {
			return new ResponseEntity<>(new MessageResponse("Thất bại! Mã giáo viên đã tồn tại", true),
					HttpStatus.BAD_REQUEST);
		} else {
			teacherService.save(teacher);
			return new ResponseEntity<>(new MessageResponse("Thêm giáo viên mới thành công", false), HttpStatus.OK);
		}
	}

	@PutMapping("/teachers")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> updateTeacher(@RequestBody TeacherDTO teacher) {
		// Validate
		String name = teacher.getName();
		Boolean checkExists = teacherService.checkExists(teacher);
		if (checkExists) {
			if (name.length() > 50) {
				return new ResponseEntity<>(new MessageResponse("Tên giáo viên không được vượt quá 50 kí tự", true),
						HttpStatus.BAD_REQUEST);
			} else {
				teacherService.update(teacher);
				return new ResponseEntity<>(new MessageResponse("Cập nhập giáo viên thành công", false), HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã giáo viên chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}

	@PostMapping("/teacher/create-account/{teacherCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	@Transactional
	public ResponseEntity<?> createTeacherAccount(@RequestBody UserDTO userDTO,
			@PathVariable("teacherCode") String teacherCode) {

		User user = new User();
		user.setUsername(userDTO.getUsername());
		user.setPassword(userDTO.getPassword());
		Iterable<User> users = userService.findAll();
		for (User currentUser : users) {
			if (currentUser.getUsername().equals(user.getUsername())) {
				return new ResponseEntity<>(new MessageResponse("Tên tài khoản đã tồn tại", true),
						HttpStatus.BAD_REQUEST);
			}
		}
		Role role = roleService.findRoleByName(userDTO.getRole());
		if (role == null) {
			return new ResponseEntity<>(new MessageResponse("Quyền không tồn tại", false), HttpStatus.BAD_REQUEST);
		} else {
			List<Role> roles = new ArrayList<>();
			roles.add(role);
			user.setRoles(roles);
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			
//	        create user
			userService.save(user);
			
//	        add account for teacher
			User newUser = userService.findByUsername(user.getUsername());
			Teacher teacher = teacherService.getById(teacherCode);
			teacher.setUser(newUser);
			return new ResponseEntity<>(new MessageResponse("Tạo tài khoản thành công", false), HttpStatus.CREATED);
		}
	}
	
	@DeleteMapping("/teachers")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	@Transactional
	public ResponseEntity<?> deleteSemester(@RequestBody TeacherDTO teacherDTO) {
		Teacher teacher = teacherService.getById(teacherDTO.getCode());
		if (teacher != null) {
			if(teacher.getUser() != null) {
				userService.delete(teacher.getUser());
			}
			teacherService.delete(teacher.getCode());
			return new ResponseEntity<>(new MessageResponse("Xóa giáo viên thành công", false), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã giáo viên chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}
}
