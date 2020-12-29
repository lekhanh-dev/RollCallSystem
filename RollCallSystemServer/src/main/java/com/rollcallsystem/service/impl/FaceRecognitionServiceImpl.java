package com.rollcallsystem.service.impl;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Scanner;

import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.Size;
import org.opencv.face.FisherFaceRecognizer;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.rollcallsystem.model.RefStudentWithLabel;
import com.rollcallsystem.model.Student;
import com.rollcallsystem.service.FaceRecognitionService;
import com.rollcallsystem.service.StudentService;

@Service
public class FaceRecognitionServiceImpl implements FaceRecognitionService {
	private FisherFaceRecognizer _model;
	private List<RefStudentWithLabel> _refStudentWithLabelList = new ArrayList<RefStudentWithLabel>();
	private int numImageForEveryStudentNeed = 5;

	@Autowired
	private StudentService studentService;

	@Override
	public void init() {
		this._model = FisherFaceRecognizer.create();
	}

	@Override
	public void loadModel(String fileNameModel, String fileRefStudentWithLable) {
		// Load model
		this._model.read(fileNameModel);
		
		// Load file ref student with lable
		List<RefStudentWithLabel> refStudentWithLabelList = new ArrayList<RefStudentWithLabel>();
		try {
		      File myObj = new File(fileRefStudentWithLable);
		      Scanner myReader = new Scanner(myObj);
		      while (myReader.hasNextLine()) {
		        String data = myReader.nextLine();
		        RefStudentWithLabel refStudentWithLabel = new RefStudentWithLabel();
		        refStudentWithLabel.setLabel(Integer.parseInt(data.split(" ")[0]));
		        refStudentWithLabel.setStudentCode(data.split(" ")[1]);
		        refStudentWithLabelList.add(refStudentWithLabel);
		      }
		      this._refStudentWithLabelList = refStudentWithLabelList;
		      myReader.close();
		    } catch (FileNotFoundException e) {
		      System.out.println("An error occurred.");
		      e.printStackTrace();
		    }
	}

	public int countImage(String imageList) {
		return imageList.split(";").length;
	}

	@Override
	public void trainingData() {
		// Load student in database
		List<Student> studentList = studentService.findAll();
		List<Integer> dataForLabelList = new ArrayList<Integer>();
		List<Mat> images = new ArrayList<Mat>();
		List<RefStudentWithLabel> refStudentWithLabelList = new ArrayList<RefStudentWithLabel>();

		int index = 0;

		for (Student student : studentList) {
			String imageList = student.getImageList();
			if (imageList != null && countImage(imageList) > numImageForEveryStudentNeed) {
				index++;
				refStudentWithLabelList.add(new RefStudentWithLabel(student.getCode(), index));
				File folder = new File("upload/image/student/" + student.getCode());
				List<File> listOfFiles = Arrays.asList(folder.listFiles());

				// Loop image
				for (File file : listOfFiles) {
					if (file.isFile()) {
						dataForLabelList.add(index);
						System.out.println(file.getPath());
						Mat img = Imgcodecs.imread(file.getPath());
						Mat imgGray = new Mat();
						Imgproc.cvtColor(img, imgGray, Imgproc.COLOR_BGR2GRAY);
						Mat iResize = new Mat();
						Imgproc.resize(imgGray, iResize, new Size(200, 200), 1.0, 1.0, Imgproc.INTER_CUBIC);

						images.add(iResize);
					}
				}
			}
		}
		
		// Add face unknow
		index++;
		refStudentWithLabelList.add(new RefStudentWithLabel("unknow", index));
		File folder = new File("data/image_face_unknow");
		List<File> listOfFiles = Arrays.asList(folder.listFiles());

		// Loop image
		for (File file : listOfFiles) {
			if (file.isFile()) {
				dataForLabelList.add(index);
				System.out.println(file.getPath());
				Mat img = Imgcodecs.imread(file.getPath());
				Mat imgGray = new Mat();
				Imgproc.cvtColor(img, imgGray, Imgproc.COLOR_BGR2GRAY);
				Mat iResize = new Mat();
				Imgproc.resize(imgGray, iResize, new Size(200, 200), 1.0, 1.0, Imgproc.INTER_CUBIC);

				images.add(iResize);
			}
		}

		// create label
		Mat labels = new Mat(new Size(dataForLabelList.size(), 1), CvType.CV_32SC1);
		int[] dataForLabel = new int[dataForLabelList.size()];
		int id = 0;
		for (int value : dataForLabelList) {
			dataForLabel[id] = value;
			id++;
		}
		labels.put(0, 0, dataForLabel);

		// Training data
		System.out.println("Start training ...");
		this._model = FisherFaceRecognizer.create();
		this._model.train(images, labels);
		System.out.println("Done training");

		// Save model and ref student with label
		System.out.println("Saving ref student with label...");
		this._refStudentWithLabelList = refStudentWithLabelList;
		try {
			File myObj = new File("model/refStudentWithLabel.txt");
			// Delete file if it exists
			if(myObj.exists()) {
				myObj.delete();
			}
			
			if (myObj.createNewFile()) {
				System.out.println("File created: " + myObj.getName());
				// Write file
				try {
					FileWriter myWriter = new FileWriter("model/refStudentWithLabel.txt");
					for (RefStudentWithLabel refStudentWithLabel : refStudentWithLabelList) {
						if (refStudentWithLabel.equals(refStudentWithLabelList.get(refStudentWithLabelList.size() - 1))) {
							myWriter.write(refStudentWithLabel.getLabel() + " " + refStudentWithLabel.getStudentCode());
						} else {
							myWriter.write(refStudentWithLabel.getLabel() + " " + refStudentWithLabel.getStudentCode() + "\n");
						}
					}
					myWriter.close();
					System.out.println("Successfully wrote to the file.");
				} catch (IOException e) {
					System.out.println("An error occurred.");
					e.printStackTrace();
				}
			} else {
				System.out.println("File already exists.");
			}
		} catch (IOException e) {
			System.out.println("An error occurred.");
			e.printStackTrace();
		}

		System.out.println("Saving model ...");
		
		File myFile = new File("model/model.xml");
		// Delete file if it exists
		if(myFile.exists()) {
			myFile.delete();
		}
		
		this._model.write("model/model.xml");
		System.out.println("Done!");
	}

	@Override
	public String predict(Mat faceMat) {
		int[] predictedLabel = {-1};
		double[] confidence = {0.0};
	    this._model.predict(faceMat, predictedLabel, confidence);
	    
	    RefStudentWithLabel refStudentWithLabel = new RefStudentWithLabel();
	    
	    String studentCode = "";
	    System.out.println(confidence[0]);
	    System.out.println("Name: " + refStudentWithLabel.getStudentCodeByLabel(predictedLabel[0], this._refStudentWithLabelList));
	    
//	    if(confidence[0] > 2000) {
//	    	studentCode = "unknow";
//	    } else {
	    	studentCode = refStudentWithLabel.getStudentCodeByLabel(predictedLabel[0], this._refStudentWithLabelList);
//	    }
	     
		return studentCode;
	}

}
