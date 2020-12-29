package com.rollcallsystem.service.impl;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.core.MatOfRect;
import org.opencv.core.Rect;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.opencv.objdetect.CascadeClassifier;
import org.springframework.stereotype.Service;

import com.rollcallsystem.service.FaceDetectionService;

@Service
public class FaceDetectionServiceImpl implements FaceDetectionService {

//	private CascadeClassifier cascadeClassifier = new CascadeClassifier();
//	private String pathClassifier = "data/haarcascade_frontalface_alt2.xml";
//	private String pathClassifier = "lbpcascade_frontalface.xml";

	@Override
	public List<byte[]> detectFace(File file) {
		List<byte[]> byteFaces = new ArrayList<byte[]>();
		Mat loadedImage = new Mat();

		loadedImage = loadImage(file);

		MatOfRect facesDetected = new MatOfRect();
		CascadeClassifier cascadeClassifier = new CascadeClassifier();
		String pathClassifier = "data/haarcascade_frontalface_alt2.xml";
		cascadeClassifier.load(pathClassifier);
		
//		int minFaceSize = Math.round(loadedImage.rows() * 0.1f);
		cascadeClassifier.detectMultiScale(loadedImage, facesDetected);//, 1.1, 3, Objdetect.CASCADE_SCALE_IMAGE,
//				new Size(minFaceSize, minFaceSize), new Size());

		Rect[] facesArray = facesDetected.toArray();
		Rect rectCrop = null;

		for (Rect face : facesArray) {
			rectCrop = new Rect(face.x, face.y, face.width, face.height);
			Mat markedImage = loadedImage.submat(rectCrop);
			MatOfByte matOfByte = new MatOfByte();
			Imgcodecs.imencode(".jpg", markedImage, matOfByte);
			byte[] bytes = matOfByte.toArray();
			byteFaces.add(bytes);
		}

		return byteFaces;
	}

//	public void loadClassifier() {
//		cascadeClassifier.load(pathClassifier);
//	}

	public static Mat loadImage(File file) {
//		byte[] bytes = file.getBytes();
//		Mat img = Imgcodecs.imdecode(new MatOfByte(bytes), Imgcodecs.IMREAD_COLOR);

		Mat img = Imgcodecs.imread(file.getPath());
		Mat imgGray = new Mat();
		Imgproc.cvtColor(img, imgGray, Imgproc.COLOR_BGR2GRAY);
		return imgGray;
	}

@Override
public List<Mat> detectFaceInClass(File file) {
	List<Mat> faceList = new ArrayList<Mat>();
	Mat loadedImage = new Mat();

	loadedImage = loadImage(file);

	MatOfRect facesDetected = new MatOfRect();
	CascadeClassifier cascadeClassifier = new CascadeClassifier();
	String pathClassifier = "data/haarcascade_frontalface_alt2.xml";
	cascadeClassifier.load(pathClassifier);
	
//	int minFaceSize = Math.round(loadedImage.rows() * 0.1f);
	cascadeClassifier.detectMultiScale(loadedImage, facesDetected);//, 1.1, 3, Objdetect.CASCADE_SCALE_IMAGE,
//			new Size(minFaceSize, minFaceSize), new Size());

	Rect[] facesArray = facesDetected.toArray();
	Rect rectCrop = null;

	for (Rect face : facesArray) {
		rectCrop = new Rect(face.x, face.y, face.width, face.height);
		Mat markedImage = loadedImage.submat(rectCrop);
		faceList.add(markedImage);
	}

	return faceList;
}

//	public static void saveImage(Mat img, String targetPath) {
//		Imgcodecs.imwrite(targetPath, img);
//	}

}
