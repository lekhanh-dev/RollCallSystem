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
import com.rollcallsystem.model.Student;
import com.rollcallsystem.model.User;
import com.rollcallsystem.model.request.StudentDTO;
import com.rollcallsystem.model.request.UserDTO;
import com.rollcallsystem.service.RoleService;
import com.rollcallsystem.service.StudentService;
import com.rollcallsystem.service.UserService;

@RestController
public class StudentController {
	
	@Autowired
	private StudentService studentService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private RoleService roleService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	@GetMapping("/students")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getAllStudent() {
		List<Student> students = studentService.findAll();
		List<HashMap<String, Object>> studentList = new ArrayList<HashMap<String, Object>>();
		for (Student student : students) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", student.getCode());
			map.put("name", student.getName());
			map.put("images", student.getImageList());
			if (student.getUser_id() != null) {
				User user = userService.findById(student.getUser_id()).get();
				map.put("username", user.getUsername());
			} else {
				map.put("username", null);
			}
			studentList.add(map);
		}
		return new ResponseEntity<>(studentList, HttpStatus.OK);
	}
	
	@GetMapping("/student/{studentCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getStudentById(@PathVariable("studentCode") String studentCode) {
		Student student = studentService.getById(studentCode);
		if(student != null) {
			HashMap<String, Object> studentDTO = new HashMap<String, Object>();
			studentDTO.put("name", student.getName());
			studentDTO.put("imageList", student.getImageList());
			return new ResponseEntity<>(studentDTO, HttpStatus.CREATED);
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã sinh viên không tồn tại", true), HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/students")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createStudent(@RequestBody StudentDTO student) {
		// Validate
		String code = student.getCode();
		String name = student.getName();
		Boolean checkExists = studentService.checkExists(student);
		if (code.length() > 10) {
			return new ResponseEntity<>(new MessageResponse("Mã sinh viên không được vượt quá 10 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (name.length() > 50) {
			return new ResponseEntity<>(new MessageResponse("Tên sinh viên không được vượt quá 50 kí tự", true),
					HttpStatus.BAD_REQUEST);
		} else if (checkExists) {
			return new ResponseEntity<>(new MessageResponse("Thất bại! Mã sinh viên đã tồn tại", true),
					HttpStatus.BAD_REQUEST);
		} else {
			studentService.save(student);
			return new ResponseEntity<>(new MessageResponse("Thêm sinh viên mới thành công", false), HttpStatus.OK);
		}
	}
	
	@PutMapping("/students")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> updateStudent(@RequestBody StudentDTO student) {
		// Validate
		String name = student.getName();
		Boolean checkExists = studentService.checkExists(student);
		if (checkExists) {
			if (name.length() > 50) {
				return new ResponseEntity<>(new MessageResponse("Tên sinh viên không được vượt quá 50 kí tự", true),
						HttpStatus.BAD_REQUEST);
			} else {
				studentService.update(student);
				return new ResponseEntity<>(new MessageResponse("Cập sinh viên viên thành công", false), HttpStatus.OK);
			}
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã sinh viên chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}
	
	@PostMapping("/student/create-account/{studentCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	@Transactional
	public ResponseEntity<?> createStudentAccount(@RequestBody UserDTO userDTO,
			@PathVariable("studentCode") String studentCode) {

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
			
//	        add account for student
			User newUser = userService.findByUsername(user.getUsername());
			Student student = studentService.getById(studentCode);
			student.setUser_id(newUser.getId());
			return new ResponseEntity<>(new MessageResponse("Tạo tài khoản thành công", false), HttpStatus.CREATED);
		}
	}
	
	@DeleteMapping("/students")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	@Transactional
	public ResponseEntity<?> deleteSemester(@RequestBody StudentDTO studentDTO) {
		Student student = studentService.getById(studentDTO.getCode());
		if (student != null) {
			if(student.getUser_id() != null) {
				userService.deleteById(student.getUser_id());
			}
			studentService.delete(student.getCode());
			return new ResponseEntity<>(new MessageResponse("Xóa sinh viên thành công", false), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Mã sinh viên chưa có trong hệ thống", true),
					HttpStatus.BAD_REQUEST);
		}
	}
}
