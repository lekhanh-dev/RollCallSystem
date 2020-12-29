package com.rollcallsystem.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "Class" )
public class ClassObj {

	@Id
	@Column(length = 20)
    private String code;
	
	@Column(name = "name", nullable = false)
    private String name;
	
	@ManyToOne
    @JoinColumn(name = "teacher_code")
    private Teacher teacher;
	
	@ManyToOne
    @JoinColumn(name = "subject_code")
    private Subject subject;
	
	@ManyToOne
    @JoinColumn(name = "semester_code")
    private Semester semester;
	
	@ManyToMany(fetch = FetchType.EAGER, mappedBy = "classObj")
    private List<Student> students;
	
	@OneToMany(mappedBy = "classObj")
	private List<RollCallListForClass> rollCallListForClass = new ArrayList<>();
	
	@Column(name = "start_date", nullable = false)
    private Date startDate;
	
	@Column(name = "end_date", nullable = false)
    private Date endDate;

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Teacher getTeacher() {
		return teacher;
	}

	public void setTeacher(Teacher teacher) {
		this.teacher = teacher;
	}

	public Subject getSubject() {
		return subject;
	}

	public void setSubject(Subject subject) {
		this.subject = subject;
	}

	public Semester getSemester() {
		return semester;
	}

	public void setSemester(Semester semester) {
		this.semester = semester;
	}

	public List<Student> getStudents() {
		return students;
	}

	public void setStudents(List<Student> students) {
		this.students = students;
	}

	public List<RollCallListForClass> getRollCallListForClass() {
		return rollCallListForClass;
	}

	public void setRollCallListForClass(List<RollCallListForClass> rollCallListForClass) {
		this.rollCallListForClass = rollCallListForClass;
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
}
