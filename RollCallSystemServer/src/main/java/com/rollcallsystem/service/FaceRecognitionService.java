package com.rollcallsystem.service;

import org.opencv.core.Mat;

public interface FaceRecognitionService {
	void init();
	void loadModel(String fileNameModel, String fileRefStudentWithLable);
	void trainingData();
	String predict(Mat faceMat);
}
