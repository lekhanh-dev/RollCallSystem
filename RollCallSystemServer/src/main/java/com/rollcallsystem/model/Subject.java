package com.rollcallsystem.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "subject" )
public class Subject {

	@Id
	@Column(name = "code", length = 10)
    private String code;
	
	@Column(name = "subjectName", nullable = false)
    private String subjectName;

	@OneToMany(mappedBy = "subject")
	private List<ClassObj> classObj = new ArrayList<>();
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getSubjectName() {
		return subjectName;
	}

	public void setSubjectName(String subjectName) {
		this.subjectName = subjectName;
	}

	public List<ClassObj> getClassObj() {
		return classObj;
	}

	public void setClassObj(List<ClassObj> classObj) {
		this.classObj = classObj;
	}
}
