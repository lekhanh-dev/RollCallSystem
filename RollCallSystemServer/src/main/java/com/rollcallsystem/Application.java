package com.rollcallsystem;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.rollcallsystem.service.FaceRecognitionService;

@SpringBootApplication
public class Application implements CommandLineRunner {

	static {
		try {
//			System.loadLibrary(Core.NATIVE_LIBRARY_NAME);
			System.load("C:/Library/opencv_custom/lib/opencv_java451.dll");
		} catch (UnsatisfiedLinkError ignore) {
			// After using spring-dev-tools, context will be loaded multiple times, so there
			// will be thrown link library has been loaded.
			// have this abnormal then the link library has been loaded, you can directly
			// swallow abnormal
		}
	}

	@Autowired
	private FaceRecognitionService faceRecognitionService;

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
		System.out.println("Listening...");
	}

	@Override
	public void run(String... arg) throws Exception {
		String fileNameModel = "model/model.xml";
		String fileRefStudentWithLable = "model/refStudentWithLabel.txt";
		faceRecognitionService.init();
		faceRecognitionService.loadModel(fileNameModel, fileRefStudentWithLable);
	}
}
