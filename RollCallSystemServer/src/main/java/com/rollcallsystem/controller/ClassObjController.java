package com.rollcallsystem.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.MessageResponse;
import com.rollcallsystem.model.RollCallListForClass;
import com.rollcallsystem.model.RollCallListForStudent;
import com.rollcallsystem.model.Schedule;
import com.rollcallsystem.model.Student;
import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.User;
import com.rollcallsystem.model.request.ClassObjDTO;
import com.rollcallsystem.model.request.ScheduleDTO;
import com.rollcallsystem.model.request.StudentInRollcall;
import com.rollcallsystem.service.ClassObjService;
import com.rollcallsystem.service.RollCallListForClassService;
import com.rollcallsystem.service.RollCallListForStudentService;
import com.rollcallsystem.service.ScheduleService;
import com.rollcallsystem.service.StudentService;
import com.rollcallsystem.service.TeacherService;
import com.rollcallsystem.service.TimeForScheduleService;
import com.rollcallsystem.service.UserService;
import com.rollcallsystem.service.impl.JwtService;

@RestController
public class ClassObjController {

	@Autowired
	private ClassObjService classObjService;

	@Autowired
	private ScheduleService scheduleService;

	@Autowired
	private RollCallListForClassService rollCallListForClassService;

	@Autowired
	private RollCallListForStudentService rollCallListForStudentService;

	@Autowired
	private TeacherService teacherService;

	@Autowired
	private StudentService studentService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserService userService;

	@Autowired
	private TimeForScheduleService timeForScheduleService;

	@GetMapping("/class")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getClassObj() {
		List<ClassObj> classObjs = classObjService.findAll();
		List<HashMap<String, Object>> classList = new ArrayList<HashMap<String, Object>>();
		for (ClassObj classObj : classObjs) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", classObj.getCode());
			map.put("name", classObj.getName());
			map.put("startDate", classObj.getStartDate());
			if (classObj.getTeacher() != null) {
				map.put("teacher", classObj.getTeacher().getName());
			} else {
				map.put("teacher", "");
			}
			if (classObj.getSubject() != null) {
				map.put("subject", classObj.getSubject().getSubjectName());
				map.put("subjectCode", classObj.getSubject().getCode());
			} else {
				map.put("subject", "");
			}
			if (classObj.getSemester() != null) {
				map.put("semester", classObj.getSemester().getCode());
			} else {
				map.put("semester", "");
			}

			ScheduleDTO scheduleDTO = scheduleService.findByClass(classObj);
			if (scheduleDTO != null) {
				map.put("schedule", scheduleDTO.getId());
			} else {
				map.put("schedule", null);
			}

			List<Student> listStudent = classObj.getStudents();
			map.put("sumStudent", listStudent.size());

			map.put("endDate", classObj.getEndDate());
			classList.add(map);
		}
		return new ResponseEntity<>(classList, HttpStatus.OK);
	}

	@PostMapping("/class")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createClassObj(@RequestBody ClassObjDTO classObjDTO) {

		classObjService.save(classObjDTO);
		return new ResponseEntity<>(new MessageResponse("Thêm lớp học phần mới thành công", false), HttpStatus.OK);
	}

	@PutMapping("/class")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> updateClassObj(@RequestBody ClassObjDTO classObjDTO) {

		classObjService.update(classObjDTO);
		return new ResponseEntity<>(new MessageResponse("Cập nhập lớp học phần mới thành công", false), HttpStatus.OK);
	}

	@DeleteMapping("/class")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> deleteClassObj(@RequestBody ClassObjDTO classObjDTO) {
		classObjService.delete(classObjDTO.getCode());
		return new ResponseEntity<>(new MessageResponse("Xóa lớp học phần thành công", false), HttpStatus.OK);
	}

	@PostMapping("/schedule/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	@Transactional
	public ResponseEntity<?> createSchedule(@RequestBody ScheduleDTO scheduleDTO,
			@PathVariable("classCode") String classCode) {
		scheduleDTO.setClassCode(classCode);
		scheduleService.save(scheduleDTO);

		List<Integer> listThu = new ArrayList<Integer>();
		if (scheduleDTO.getSunday() != "")
			listThu.add(1);
		if (scheduleDTO.getMonday() != "")
			listThu.add(2);
		if (scheduleDTO.getTuesday() != "")
			listThu.add(3);
		if (scheduleDTO.getWednesday() != "")
			listThu.add(4);
		if (scheduleDTO.getThursday() != "")
			listThu.add(5);
		if (scheduleDTO.getFriday() != "")
			listThu.add(6);
		if (scheduleDTO.getSaturday() != "")
			listThu.add(7);

		// create roll call for class
		ClassObj classObj = classObjService.findByCode(classCode);
		String startDate = classObj.getStartDate().toString();
		String endDate = classObj.getEndDate().toString();

		LocalDate start = LocalDate.parse(startDate), end = LocalDate.parse(endDate);

		LocalDate next = start.minusDays(1);
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		while ((next = next.plusDays(1)).isBefore(end.plusDays(1))) {
			Date date = new Date();
			try {
				date = sdf.parse(next.toString());
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			Calendar c = Calendar.getInstance();
			c.setTime(date);
			int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);
			if (listThu.contains(dayOfWeek)) {
				// save
				RollCallListForClass rollCallListForClass = new RollCallListForClass();
				rollCallListForClass.setDate(new java.sql.Date(date.getTime()));
				rollCallListForClass.setClassObj(classObj);
				rollCallListForClassService.save(rollCallListForClass);
			}
		}

		return new ResponseEntity<>(new MessageResponse("Thêm lịch trình thành công", false), HttpStatus.OK);
	}

	@GetMapping("/schedule/{scheduleId}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createSchedule(@PathVariable("scheduleId") Long scheduleId) {
		Schedule schedule = scheduleService.findById(scheduleId);
		return new ResponseEntity<>(schedule, HttpStatus.OK);
	}

	@GetMapping("/teacher-for-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> createSchedule(@PathVariable("classCode") String classCode) {
		ClassObj classObj = classObjService.findByCode(classCode);
		ScheduleDTO schedule = scheduleService.findByClass(classObj);
		List<Teacher> teacherAll = teacherService.findAll();
		List<Teacher> teacherSatisfy = new ArrayList<Teacher>();

		for (Teacher teacher : teacherAll) {
			Boolean check = true;
			List<ClassObj> classList = classObjService.findByTeacher(teacher);
			for (ClassObj c : classList) {
				ScheduleDTO s = scheduleService.findByClass(c);
				if (checkExistsConcurrently(schedule.getMonday(), s.getMonday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getTuesday(), s.getTuesday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getWednesday(), s.getWednesday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getThursday(), s.getThursday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getFriday(), s.getFriday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getSaturday(), s.getSaturday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getSunday(), s.getSunday())) {
					check = false;
					break;
				}
			}
			if (check)
				teacherSatisfy.add(teacher);
		}

		List<HashMap<String, Object>> teacherSatisfyDTO = new ArrayList<HashMap<String, Object>>();
		for (Teacher teacher : teacherSatisfy) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", teacher.getCode());
			map.put("name", teacher.getName());
			teacherSatisfyDTO.add(map);
		}
		return new ResponseEntity<>(teacherSatisfyDTO, HttpStatus.OK);
	}

	public Boolean checkExistsConcurrently(String str1, String str2) {
		if (str1.equals(""))
			return false;
		if (str2.equals(""))
			return false;
		String[] array1 = str1.split(",");
		String[] array2 = str2.split(",");
		for (String string : array1) {
			for (String string2 : array2) {
				if (string.equals(string2)) {
					return true;
				}
			}
		}
		return false;
	}

	@PostMapping("/teacher-for-class")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> addTeacherForClass(@RequestBody HashMap<String, String> map) {
		String classCode = map.get("classCode");
		String teacherCode = map.get("teacherCode");
		ClassObj classObj = classObjService.findByCode(classCode);
		Teacher teacher = teacherService.getById(teacherCode);
		classObj.setTeacher(teacher);
		classObjService.save(classObj);

		return new ResponseEntity<>("Thêm giáo viên thành công", HttpStatus.OK);
	}

	@GetMapping("/student-by-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getStudentByClass(@PathVariable("classCode") String classCode) {
		ClassObj classObj = classObjService.findByCode(classCode);
		ScheduleDTO schedule = scheduleService.findByClass(classObj);
		List<Student> studentList = studentService.findAll();
		List<Student> studentSatisfy = new ArrayList<Student>();

		for (Student student : studentList) {
			Boolean check = true;
			List<ClassObj> classObjList = student.getClassObj();

			for (ClassObj c : classObjList) {
				ScheduleDTO s = scheduleService.findByClass(c);
				if (checkExistsConcurrently(schedule.getMonday(), s.getMonday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getTuesday(), s.getTuesday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getWednesday(), s.getWednesday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getThursday(), s.getThursday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getFriday(), s.getFriday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getSaturday(), s.getSaturday())) {
					check = false;
					break;
				}
				if (checkExistsConcurrently(schedule.getSunday(), s.getSunday())) {
					check = false;
					break;
				}
			}
			if (check)
				studentSatisfy.add(student);
		}

		List<HashMap<String, Object>> studentSatisfyDTO = new ArrayList<HashMap<String, Object>>();
		for (Student student : studentSatisfy) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", student.getCode());
			map.put("name", student.getName());
			studentSatisfyDTO.add(map);
		}

		return new ResponseEntity<>(studentSatisfyDTO, HttpStatus.OK);
	}

	@GetMapping("/student-in-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getStudentInClass(@PathVariable("classCode") String classCode) {
		ClassObj classObj = classObjService.findByCode(classCode);
		List<Student> studentList = classObj.getStudents();
		List<HashMap<String, Object>> studentListDTO = new ArrayList<HashMap<String, Object>>();
		for (Student student : studentList) {
			HashMap<String, Object> map = new HashMap<String, Object>();
			map.put("code", student.getCode());
			map.put("name", student.getName());
			studentListDTO.add(map);
		}

		return new ResponseEntity<>(studentListDTO, HttpStatus.OK);
	}

	@GetMapping("/class-by-code/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> getClassByCode(@PathVariable("classCode") String classCode) {
		ClassObjDTO classObj = classObjService.getByCode(classCode);

		return new ResponseEntity<>(classObj, HttpStatus.OK);
	}

	@PostMapping("/add-student-to-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> addStudentToClass(@PathVariable("classCode") String classCode,
			@RequestBody List<String> studentCodeList) {
		ClassObj classObj = classObjService.findByCode(classCode);
		List<Student> studentList = classObj.getStudents();
		List<Student> studentListAddedNew = new ArrayList<Student>();

		for (String studentCode : studentCodeList) {
			Student student = studentService.getById(studentCode);
			List<ClassObj> classObjList = student.getClassObj();
			classObjList.add(classObj);
			student.setClassObj(classObjList);

			studentList.add(student);
			studentListAddedNew.add(student);
		}

		classObj.setStudents(studentList);
		classObjService.save(classObj);

		// create history for student
		List<RollCallListForClass> rollCallListForClassList = classObj.getRollCallListForClass();
		for (RollCallListForClass rollCallListForClass : rollCallListForClassList) {
			for (Student student : studentListAddedNew) {
				RollCallListForStudent rollCallListForStudent = new RollCallListForStudent();
				rollCallListForStudent.setRollCallListForClass(rollCallListForClass);
				rollCallListForStudent.setStudentCode(student.getCode());
				rollCallListForStudent.setStatus(null);
				rollCallListForStudentService.save(rollCallListForStudent);
			}
		}

		return new ResponseEntity<>(studentList, HttpStatus.OK);
	}

	public Boolean checkRoleForEveryTeacher(HttpServletRequest request, String teacherCode) {
		String authHeader = request.getHeader("Authorization");
		String jwt = authHeader.replace("Bearer ", "");
		if (jwt == null) {
			return false;
		} else {
			String username = jwtService.getUserNameFromJwtToken(jwt);
			User user = userService.findByUsername(username);
			Long idFromToken = user.getId();

			Teacher teacher = teacherService.getById(teacherCode);
			Long idFromTeacher = teacher.getUser().getId();
			if (idFromToken == idFromTeacher) {
				return true;
			} else {
				return false;
			}
		}
	}

	public Boolean checkDate(List<RollCallListForClass> rollCallListForClassList) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date currentDate = new Date();
		String currentDateString = sdf.format(currentDate);
		for (RollCallListForClass rollCallListForClass : rollCallListForClassList) {
			String dateString = rollCallListForClass.getDate().toString();
			if (currentDateString.contentEquals(dateString)) {
				return true;
			}
		}
		return false;
	}

	public String formatTime(String tietString) {
		String[] tietArray = tietString.split(",");
		if (tietArray.length > 1) {
			String timeStart = timeForScheduleService.getByName(Long.parseLong(tietArray[0])).getTimeStart();
			String timeEnd = timeForScheduleService.getByName(Long.parseLong(tietArray[tietArray.length - 1]))
					.getTimeEnd();
			return timeStart + " - " + timeEnd;
		} else {
			String timeStart = timeForScheduleService.getByName(Long.parseLong(tietArray[0])).getTimeStart();
			String timeEnd = timeForScheduleService.getByName(Long.parseLong(tietArray[0])).getTimeEnd();
			return timeStart + " - " + timeEnd;
		}
	}

	public List<String> getTime(ScheduleDTO scheduleDTO) {
		List<String> timeStringList = new ArrayList<String>();
		if (!scheduleDTO.getMonday().equals("")) {
			String timeString = formatTime(scheduleDTO.getMonday());
			timeStringList.add("2 | " + timeString);
		}
		if (!scheduleDTO.getTuesday().equals("")) {
			String timeString = formatTime(scheduleDTO.getTuesday());
			timeStringList.add("3 | " + timeString);
		}
		if (!scheduleDTO.getWednesday().equals("")) {
			String timeString = formatTime(scheduleDTO.getWednesday());
			timeStringList.add("4 | " + timeString);
		}
		if (!scheduleDTO.getThursday().equals("")) {
			String timeString = formatTime(scheduleDTO.getThursday());
			timeStringList.add("5 | " + timeString);
		}
		if (!scheduleDTO.getFriday().equals("")) {
			String timeString = formatTime(scheduleDTO.getFriday());
			timeStringList.add("6 | " + timeString);
		}
		if (!scheduleDTO.getSaturday().equals("")) {
			String timeString = formatTime(scheduleDTO.getSaturday());
			timeStringList.add("7 | " + timeString);
		}
		if (!scheduleDTO.getSunday().equals("")) {
			String timeString = formatTime(scheduleDTO.getSunday());
			timeStringList.add("CN | " + timeString);
		}

		return timeStringList;
	}

	@SuppressWarnings("deprecation")
	public Boolean checkTime(ScheduleDTO scheduleDTO) {
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
		Date date = new Date();
		String dateString = sdf.format(date);
		try {
			date = sdf.parse(dateString);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		Calendar c = Calendar.getInstance();
		c.setTime(date);
		int dayOfWeek = c.get(Calendar.DAY_OF_WEEK);

		String timeSting = "";
		if (dayOfWeek == 1) {
			timeSting = formatTime(scheduleDTO.getSunday());
		}
		if (dayOfWeek == 2) {
			timeSting = formatTime(scheduleDTO.getMonday());
		}
		if (dayOfWeek == 3) {
			timeSting = formatTime(scheduleDTO.getTuesday());
		}
		if (dayOfWeek == 4) {
			timeSting = formatTime(scheduleDTO.getWednesday());
		}
		if (dayOfWeek == 5) {
			timeSting = formatTime(scheduleDTO.getThursday());
		}
		if (dayOfWeek == 6) {
			timeSting = formatTime(scheduleDTO.getFriday());
		}
		if (dayOfWeek == 7) {
			timeSting = formatTime(scheduleDTO.getSaturday());
		}

		Date time = new Date();
		int hour = time.getHours();
		int minute = time.getMinutes();

		String timeStart = timeSting.split(" - ")[0];
		String timeEnd = timeSting.split(" - ")[1];

		if (Integer.parseInt(timeStart.split(":")[0]) < hour && Integer.parseInt(timeEnd.split(":")[0]) > hour) {
			return true;
		}

		if (Integer.parseInt(timeStart.split(":")[0]) == hour) {
			if (Integer.parseInt(timeStart.split(":")[1]) <= minute) {
				return true;
			}
		}

		if (Integer.parseInt(timeEnd.split(":")[0]) == hour) {
			if (Integer.parseInt(timeEnd.split(":")[1]) >= minute) {
				return true;
			}
		}

		return false;
	}

	@GetMapping("/class-of-teacher/{teacherCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> getClassOfTeacher(@PathVariable("teacherCode") String teacherCode,
			HttpServletRequest request) {
		Boolean check = checkRoleForEveryTeacher(request, teacherCode);
		if (check) {
			Teacher teacher = teacherService.getById(teacherCode);
			List<ClassObj> classList = classObjService.findByTeacher(teacher);
			List<HashMap<String, Object>> classListDTO = new ArrayList<HashMap<String, Object>>();
			HashMap<String, Object> classActive = new HashMap<String, Object>();

			Boolean checkClassActive = false;

			for (ClassObj classObj : classList) {
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("code", classObj.getCode());
				map.put("name", classObj.getName());
				map.put("startDate", classObj.getStartDate());
				map.put("endDate", classObj.getEndDate());
				map.put("subject", classObj.getSubject().getSubjectName());

				List<RollCallListForClass> rollCallListForClassList = classObj.getRollCallListForClass();
				Boolean checkDate = checkDate(rollCallListForClassList);

				ScheduleDTO scheduleDTO = scheduleService.findByClass(classObj);
				List<String> timeStringList = getTime(scheduleDTO);
				map.put("time", timeStringList);

				if (checkDate) {
					Boolean checkTime = checkTime(scheduleDTO);
					if (checkTime) {
						map.put("isActive", true);
						classActive = map;
						checkClassActive = true;
					} else {
						map.put("isActive", false);
						classListDTO.add(map);
					}
				} else {
					map.put("isActive", false);
					classListDTO.add(map);
				}
			}

			if (checkClassActive) {
				classListDTO.add(classActive);
			}

			return new ResponseEntity<>(classListDTO, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Access Denied!", true), HttpStatus.BAD_REQUEST);
		}
	}

	public String getTeacherCodeByToken(HttpServletRequest request) {
		String authHeader = request.getHeader("Authorization");
		String jwt = authHeader.replace("Bearer ", "");
		if (jwt == null) {
			return null;
		} else {
			String username = jwtService.getUserNameFromJwtToken(jwt);
			User user = userService.findByUsername(username);
			Long idFromToken = user.getId();

			List<Teacher> teacherList = teacherService.findAll();
			for (Teacher teacher : teacherList) {
				if (teacher.getUser() != null) {
					if (idFromToken.equals(teacher.getUser().getId())) {
						return teacher.getCode();
					}
				}
			}
			return null;
		}
	}

	@GetMapping("/get-student-in-class/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> getStudentInClass(@PathVariable("classCode") String classCode,
			HttpServletRequest request) {
		List<HashMap<String, Object>> studentDTO = new ArrayList<HashMap<String, Object>>();
		// check teacher
		String teacherCode = getTeacherCodeByToken(request);
		if (teacherCode == null) {
			return new ResponseEntity<>(new MessageResponse("Teacher not exist", true), HttpStatus.BAD_REQUEST);
		}
		// check teacher - class
		ClassObj classObj = classObjService.findByCode(classCode);
		if (!classObj.getTeacher().getCode().equals(teacherCode)) {
			return new ResponseEntity<>(new MessageResponse("Teacher have not access to class", true),
					HttpStatus.BAD_REQUEST);
		} else {
			// Get student in class
			List<Student> studentList = classObj.getStudents();

			// Get roll call list class
			List<RollCallListForClass> rollCallListForClassList = classObj.getRollCallListForClass();

			for (Student student : studentList) {
				int numKoDiHoc = 0;
				for (RollCallListForClass rollCallListForClass : rollCallListForClassList) {
					List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass
							.getRollCallListForStudent();
					for (RollCallListForStudent rollCallListForStudent : rollCallListForStudentList) {
						if (rollCallListForStudent.getStudentCode().equals(student.getCode())) {
							if (rollCallListForStudent.getStatus() != null
									&& rollCallListForStudent.getStatus() == 0L) {
								numKoDiHoc++;
							}
						}
					}
				}
				HashMap<String, Object> map = new HashMap<String, Object>();
				map.put("code", student.getCode());
				map.put("name", student.getName());
				double rate = numKoDiHoc / (rollCallListForClassList.size() * 1.0);
				String rateString = String.valueOf((double) Math.round(rate * 100) / 100);
				map.put("rate", rateString + " %");
				studentDTO.add(map);
			}
			return new ResponseEntity<>(studentDTO, HttpStatus.OK);
		}
	}

	@GetMapping("/get-rollcall-date-list/{classCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> getRollCallDateList(@PathVariable("classCode") String classCode,
			HttpServletRequest request) {

		List<HashMap<String, Object>> rollcallList = new ArrayList<HashMap<String, Object>>();
		// check teacher
		String teacherCode = getTeacherCodeByToken(request);
		if (teacherCode == null) {
			return new ResponseEntity<>(new MessageResponse("Teacher not exist", true), HttpStatus.BAD_REQUEST);
		}
		// check teacher - class
		ClassObj classObj = classObjService.findByCode(classCode);
		if (!classObj.getTeacher().getCode().equals(teacherCode)) {
			return new ResponseEntity<>(new MessageResponse("Teacher have not access to class", true),
					HttpStatus.BAD_REQUEST);
		} else {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date curentDate = new Date();

			List<RollCallListForClass> rollCallListForClassList = classObj.getRollCallListForClass();
			for (RollCallListForClass rollCallListForClass : rollCallListForClassList) {
				try {
					Date dateElement = sdf.parse(rollCallListForClass.getDate().toString());
					int check = dateElement.compareTo(curentDate);
					if (check <= 0) {
						HashMap<String, Object> map = new HashMap<String, Object>();
						map.put("date", rollCallListForClass.getDate().toString());

						List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass
								.getRollCallListForStudent();
						int count = 0;
						for (RollCallListForStudent rollCallListForStudent : rollCallListForStudentList) {
							if (rollCallListForStudent.getStatus() != null
									&& rollCallListForStudent.getStatus() == 1L) {
								count++;
							}
						}
						map.put("rate", count + "/" + rollCallListForStudentList.size());
						rollcallList.add(map);
					}
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
			return new ResponseEntity<>(rollcallList, HttpStatus.OK);
		}
	}

	@GetMapping("/get-detail-student-in-rollcall/{classCode}/{date}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> getDetailStudentInRollcall(@PathVariable("classCode") String classCode,
			@PathVariable("date") String dateDTO, HttpServletRequest request) {

		List<HashMap<String, Object>> studentList = new ArrayList<HashMap<String, Object>>();
		// check teacher
		String teacherCode = getTeacherCodeByToken(request);
		if (teacherCode == null) {
			return new ResponseEntity<>(new MessageResponse("Teacher not exist", true), HttpStatus.BAD_REQUEST);
		}
		// check teacher - class
		ClassObj classObj = classObjService.findByCode(classCode);
		if (!classObj.getTeacher().getCode().equals(teacherCode)) {
			return new ResponseEntity<>(new MessageResponse("Teacher have not access to class", true),
					HttpStatus.BAD_REQUEST);
		} else {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date;
			try {
				date = sdf.parse(dateDTO);
				RollCallListForClass rollCallListForClass = rollCallListForClassService
						.findByExmaple(new java.sql.Date(date.getTime()), classObj);
				List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass
						.getRollCallListForStudent();
				for (RollCallListForStudent rollCallListForStudent : rollCallListForStudentList) {
					HashMap<String, Object> map = new HashMap<String, Object>();
					map.put("code", rollCallListForStudent.getStudentCode());
					map.put("name", studentService.getById(rollCallListForStudent.getStudentCode()).getName());
					if (rollCallListForStudent.getStatus() == null) {
						map.put("status", null);
						studentList.add(map);
						continue;
					}
					if (rollCallListForStudent.getStatus() == 0L) {
						map.put("status", 0);
					}
					if (rollCallListForStudent.getStatus() == 1L) {
						map.put("status", 1);
					}
					studentList.add(map);
				}
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<>(studentList, HttpStatus.OK);
		}
	}

	@PostMapping("/update-status-student-in-rollcall/{classCode}/{date}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> updateStatusStudentInRollcall(@PathVariable("classCode") String classCode,
			@PathVariable("date") String dateDTO, @RequestBody List<StudentInRollcall> studentInRollcallList, HttpServletRequest request) {

		// check teacher
		String teacherCode = getTeacherCodeByToken(request);
		if (teacherCode == null) {
			return new ResponseEntity<>(new MessageResponse("Teacher not exist", true), HttpStatus.BAD_REQUEST);
		}
		// check teacher - class
		ClassObj classObj = classObjService.findByCode(classCode);
		if (!classObj.getTeacher().getCode().equals(teacherCode)) {
			return new ResponseEntity<>(new MessageResponse("Teacher have not access to class", true),
					HttpStatus.BAD_REQUEST);
		} else {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date;
			try {
				date = sdf.parse(dateDTO);
				RollCallListForClass rollCallListForClass = rollCallListForClassService
						.findByExmaple(new java.sql.Date(date.getTime()), classObj);
				List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass
						.getRollCallListForStudent();
				int index = 0;
				for (RollCallListForStudent rollCallListForStudent : rollCallListForStudentList) {
					for(StudentInRollcall studentInRollcall : studentInRollcallList) {
						if(rollCallListForStudent.getStudentCode().equals(studentInRollcall.getCode())) {
							rollCallListForStudent.setStatus(studentInRollcall.getStatus());
							rollCallListForStudentList.set(index, rollCallListForStudent);
						}
						
					}
					index++;
				}
				rollCallListForClass.setRollCallListForStudent(rollCallListForStudentList);
				rollCallListForClassService.save(rollCallListForClass);
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return new ResponseEntity<>("upload successful", HttpStatus.OK);
		}
	}
}
