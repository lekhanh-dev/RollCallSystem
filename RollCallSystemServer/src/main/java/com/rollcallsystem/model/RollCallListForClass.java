package com.rollcallsystem.model;

import java.sql.Date;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name = "RollCallListForClass" )
public class RollCallListForClass {
	
	@Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(name = "date", nullable = false)
    private Date date;
	
	@Column(name = "image")
    private String stringImage;
	
	@ManyToOne
    @JoinColumn(name = "class_id", nullable = false)
    private ClassObj classObj;
	
	@OneToMany(mappedBy = "rollCallListForClass")
	private List<RollCallListForStudent> rollCallListForStudent = new ArrayList<>();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

	public String getStringImage() {
		return stringImage;
	}

	public void setStringImage(String stringImage) {
		this.stringImage = stringImage;
	}

	public ClassObj getClassObj() {
		return classObj;
	}

	public void setClassObj(ClassObj classObj) {
		this.classObj = classObj;
	}

	public List<RollCallListForStudent> getRollCallListForStudent() {
		return rollCallListForStudent;
	}

	public void setRollCallListForStudent(List<RollCallListForStudent> rollCallListForStudent) {
		this.rollCallListForStudent = rollCallListForStudent;
	}
}
