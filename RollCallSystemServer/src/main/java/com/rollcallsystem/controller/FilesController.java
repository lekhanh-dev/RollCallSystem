package com.rollcallsystem.controller;

import java.io.File;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;

import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.imgproc.Imgproc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.FileInfo;
import com.rollcallsystem.model.MessageResponse;
import com.rollcallsystem.model.RollCallListForClass;
import com.rollcallsystem.model.RollCallListForStudent;
import com.rollcallsystem.model.Student;
import com.rollcallsystem.model.Teacher;
import com.rollcallsystem.model.User;
import com.rollcallsystem.service.ClassObjService;
import com.rollcallsystem.service.FaceDetectionService;
import com.rollcallsystem.service.FaceRecognitionService;
import com.rollcallsystem.service.FilesStorageService;
import com.rollcallsystem.service.RollCallListForClassService;
import com.rollcallsystem.service.RollCallListForStudentService;
import com.rollcallsystem.service.StudentService;
import com.rollcallsystem.service.TeacherService;
import com.rollcallsystem.service.UserService;
import com.rollcallsystem.service.impl.JwtService;

@RestController
public class FilesController {

	@Autowired
	FilesStorageService storageService;

	@Autowired
	private StudentService studentService;

	@Autowired
	private FaceDetectionService FaceDetectionService;

	@Autowired
	private FaceRecognitionService faceRecognitionService;

	@Autowired
	private JwtService jwtService;

	@Autowired
	private UserService userService;

	@Autowired
	private TeacherService teacherService;

	@Autowired
	private ClassObjService classObjService;

	@Autowired
	private RollCallListForClassService rollCallListForClassService;

	@Autowired
	private RollCallListForStudentService rollCallListForStudentService;

	@PostMapping("/upload-student-image")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<MessageResponse> uploadFiles(@RequestParam("files") MultipartFile[] files,
			@RequestParam("studentCode") String studentCode) {
		String message = "";
		String path = "";
		try {
			List<String> fileNames = new ArrayList<>();
			Random rand = new Random();
			int upperbound = 1000000000;
			Arrays.asList(files).stream().forEach(file -> {
				String fileName = rand.nextInt(upperbound) + ".jpg";
				byte[] bytes;

				try {
					bytes = file.getBytes();
					storageService.saveStudentImage(bytes, studentCode, fileName);
				} catch (IOException e) {
					e.printStackTrace();
				}
				fileNames.add(fileName);
//				List<byte[]> byteFaces = new ArrayList<byte[]>();
//				byteFaces = FaceDetectionService.detectFace(file);

//				for (byte[] byteFace : byteFaces) {
//					String fileName = rand.nextInt(upperbound) + ".jpg";
//					storageService.saveStudentImage(byteFace, studentCode, fileName);
//					fileNames.add(fileName);
//				}
			});

			path = "upload/image/student/" + studentCode + "/" + fileNames.get(0);
			File file = new File(path);
			List<byte[]> byteFaces = new ArrayList<byte[]>();
			byteFaces = FaceDetectionService.detectFace(file);

			for (byte[] byteFace : byteFaces) {
				String fileName = rand.nextInt(upperbound) + ".jpg";
				storageService.saveStudentImage(byteFace, studentCode, fileName);
			}
			file.delete();

			message = "Tải lên tập tin thành công";
			return ResponseEntity.status(HttpStatus.OK).body(new MessageResponse(message, false));
		} catch (Exception e) {
			message = "Tải lên tập tin thất bại";
			new File(path).delete();
			return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new MessageResponse(message, true));
		}
	}

	@PostMapping("/save-file-name/{studentCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<MessageResponse> saveFileName(@PathVariable("studentCode") String studentCode) {
		File folder = new File("upload/image/student/" + studentCode);

		Student student = studentService.getById(studentCode);
		String listNameFile = "";
		if (folder.exists()) {
			List<File> listOfFiles = Arrays.asList(folder.listFiles());
			for (File file : listOfFiles) {
				if (file.isFile()) {
					listNameFile += file.getName();
					listNameFile += ";";
				}
			}
			student.setImageList(listNameFile);
			studentService.save(student);
			return new ResponseEntity<>(new MessageResponse("Save file name successful", false), HttpStatus.OK);
		} else {
			return new ResponseEntity<>(new MessageResponse("Folder not exist", true), HttpStatus.BAD_REQUEST);
		}
	}

	@GetMapping("/training-data")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<MessageResponse> trainingData() {
		faceRecognitionService.trainingData();
		return new ResponseEntity<>(new MessageResponse("Training done...!", false), HttpStatus.OK);
	}

	@GetMapping("/files/{studentCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<List<FileInfo>> getListFiles(@PathVariable("studentCode") String studentCode) {
		List<FileInfo> fileInfos = storageService.loadAllStudent(studentCode).map(path -> {
			String filename = path.getFileName().toString();
//			String url = MvcUriComponentsBuilder
//					.fromMethodName(FilesController.class, "getFile", path.getFileName().toString()).build().toString();
			String url = "http://localhost:8092/images/" + studentCode + "/" + filename;
			return new FileInfo(filename, url);
		}).collect(Collectors.toList());

		return ResponseEntity.status(HttpStatus.OK).body(fileInfos);
	}

	@GetMapping("/images/{studentCode}/{filename:.+}")
//	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<Resource> getFile(@PathVariable String filename,
			@PathVariable("studentCode") String studentCode) {
		Resource file = storageService.load(filename, studentCode);

		return ResponseEntity.ok()
				.header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
				.body(file);
	}

	@DeleteMapping("/image/{studentCode}/{imageName}")
	@PreAuthorize("hasAnyAuthority('ROLE_ADMIN')")
	public ResponseEntity<?> deleteImage(@PathVariable("imageName") String imageName,
			@PathVariable("studentCode") String studentCode) {
		storageService.delete(imageName, studentCode);
		Student student = studentService.getById(studentCode);
		String imageList = student.getImageList();
		imageList = imageList.replace(imageName + ";", "");
		student.setImageList(imageList);
		studentService.save(student);

		return new ResponseEntity<>(new MessageResponse("Delete image successful", false), HttpStatus.OK);
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

	@PostMapping("/upload-rollcall-image")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<?> uploadRollCallImage(@RequestParam("files") MultipartFile[] files,
			@RequestParam("classCode") String classCode, HttpServletRequest request) {
		String message = "";
		String path = "";
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
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = new Date();
			String dateString = sdf.format(date);

			try {
				List<String> fileNames = new ArrayList<>();
				Random rand = new Random();
				int upperbound = 1000000000;
				Arrays.asList(files).stream().forEach(file -> {
					String fileName = rand.nextInt(upperbound) + ".jpg";
					byte[] bytes;

					try {
						bytes = file.getBytes();
						storageService.saveRollCallImage(bytes, classCode, fileName);
					} catch (IOException e) {
						e.printStackTrace();
					}
					fileNames.add(fileName);
				});

				path = "upload/image/rollcall/" + classCode + "/" + dateString + "/" + fileNames.get(0);
				File file = new File(path);
				List<Mat> faceList = FaceDetectionService.detectFaceInClass(file);
				System.out.println(faceList.size());

				if (faceList.size() > 0) {
					// Get roll call list class
					RollCallListForClass rollCallListForClass = rollCallListForClassService
							.findByExmaple(new java.sql.Date(date.getTime()), classObj);
					List<RollCallListForStudent> rollCallListForStudentList = rollCallListForClass
							.getRollCallListForStudent();
					for (Mat mat : faceList) {
//						Mat imgGray = new Mat();
//						Imgproc.cvtColor(mat, imgGray, Imgproc.COLOR_BGR2GRAY);
						Mat imgResize = new Mat();
						Imgproc.resize(mat, imgResize, new Size(200, 200), 1.0, 1.0, Imgproc.INTER_CUBIC);
						String studentCode = faceRecognitionService.predict(imgResize);
						if (studentCode != "unknow") {
							int index = 0;
							for (RollCallListForStudent rollCallListForStudent : rollCallListForStudentList) {
								if (rollCallListForStudent.getStudentCode().equals(studentCode)) {
									rollCallListForStudent.setStatus(1L);
									rollCallListForStudentList.set(index, rollCallListForStudent);
									HashMap<String, Object> map = new HashMap<String, Object>();
									map.put("code", studentCode);
									map.put("name", studentService.getById(studentCode).getName());
									studentDTO.add(map);
								} else {
									if(rollCallListForStudent.getStatus() != null && rollCallListForStudent.getStatus() == 1L) {
										index++;
										continue;
									} else {
										rollCallListForStudent.setStatus(0L);
										rollCallListForStudentList.set(index, rollCallListForStudent);
									}
								}
								index++;
							}
						}
					}
					rollCallListForClass.setRollCallListForStudent(rollCallListForStudentList);
					rollCallListForClassService.save(rollCallListForClass);
				}

				message = "Tải lên tập tin thành công";
				return new ResponseEntity<>(studentDTO, HttpStatus.OK);
			} catch (Exception e) {
				return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(new MessageResponse(message, true));
			}
		}
	}

	@PostMapping("/save-rollcall-image/{classObjCode}")
	@PreAuthorize("hasAnyAuthority('ROLE_TEACHER')")
	public ResponseEntity<MessageResponse> saveRollcallImage(@PathVariable("classObjCode") String classObjCode,
			HttpServletRequest request) {
		// check teacher
		String teacherCode = getTeacherCodeByToken(request);
		if (teacherCode == null) {
			return new ResponseEntity<>(new MessageResponse("Teacher not exist", true), HttpStatus.BAD_REQUEST);
		}
		// check teacher - class
		ClassObj classObj = classObjService.findByCode(classObjCode);
		if (!classObj.getTeacher().getCode().equals(teacherCode)) {
			return new ResponseEntity<>(new MessageResponse("Teacher have not access to class", true),
					HttpStatus.BAD_REQUEST);
		} else {
			SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
			Date date = new Date();
			String dateString = sdf.format(date);

			File folder = new File("upload/image/rollcall/" + classObjCode + "/" + dateString);
			RollCallListForClass rollCallListForClass = rollCallListForClassService
					.findByExmaple(new java.sql.Date(date.getTime()), classObj);
			String listNameFile = "";
			if (folder.exists()) {
				List<File> listOfFiles = Arrays.asList(folder.listFiles());
				for (File file : listOfFiles) {
					if (file.isFile()) {
						listNameFile += file.getName();
						listNameFile += ";";
					}
				}
				rollCallListForClass.setStringImage(listNameFile);
				rollCallListForClassService.save(rollCallListForClass);
				return new ResponseEntity<>(new MessageResponse("Save file name successful", false), HttpStatus.OK);
			} else {
				return new ResponseEntity<>(new MessageResponse("Folder not exist", true), HttpStatus.BAD_REQUEST);
			}
		}
	}
}
