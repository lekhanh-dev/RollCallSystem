package com.rollcallsystem.model;

import java.util.List;

public class RefStudentWithLabel {
	private String studentCode;
	private int label;

	public RefStudentWithLabel() {

	}

	public RefStudentWithLabel(String studentCode, int label) {
		this.studentCode = studentCode;
		this.label = label;
	}

	public String getStudentCodeByLabel(int label, List<RefStudentWithLabel> refStudentWithLabelList) {
		String studentCode = "";
		for (RefStudentWithLabel refStudentWithLabel : refStudentWithLabelList) {
			if(label == refStudentWithLabel.getLabel()) {
				studentCode = refStudentWithLabel.getStudentCode();
			}
		}
		return studentCode;
	}
	
	public String getStudentCode() {
		return studentCode;
	}

	public void setStudentCode(String studentCode) {
		this.studentCode = studentCode;
	}

	public int getLabel() {
		return label;
	}

	public void setLabel(int label) {
		this.label = label;
	}
}
