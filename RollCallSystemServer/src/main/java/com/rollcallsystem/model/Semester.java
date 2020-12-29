package com.rollcallsystem.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "semesters")
public class Semester {

	@Id
	@Column(length = 15)
    private String code;
	
	@Column(name = "semesterName", nullable = false)
    private String semesterName;
	
	@Column(name = "startDate",nullable = false)
	private Date startDate;
	 
	@Column(name = "endDate",nullable = false)
	private Date endDate;

	@OneToMany(mappedBy = "semester")
	private List<ClassObj> classObj = new ArrayList<>();
	
	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getSemesterName() {
		return semesterName;
	}

	public void setSemesterName(String semesterName) {
		this.semesterName = semesterName;
	}

	public Date getStartDate() {
		return startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public List<ClassObj> getClassObj() {
		return classObj;
	}

	public void setClassObj(List<ClassObj> classObj) {
		this.classObj = classObj;
	}
}
