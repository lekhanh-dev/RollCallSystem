package com.rollcallsystem.service;

import java.io.File;
import java.util.List;

import org.opencv.core.Mat;

public interface FaceDetectionService {
	List<byte[]> detectFace(File file);
	List<Mat> detectFaceInClass(File file);
}
