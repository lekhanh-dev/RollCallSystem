package com.rollcallsystem.model;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "teacher" )
public class Teacher {

	@Id
	@Column(length = 10)
    private String code;
	
	@Column(name = "name", length = 50, nullable = false)
    private String name;
	
	@OneToOne
    @JoinColumn(name = "user_id", unique = true)
	private User user;

	@OneToMany(mappedBy = "teacher")
	private List<ClassObj> classObj = new ArrayList<>();
	
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

	public User getUser() {
		return user;
	}

	public void setUser(User user) {
		this.user = user;
	}

	public List<ClassObj> getClassObj() {
		return classObj;
	}

	public void setClassObj(List<ClassObj> classObj) {
		this.classObj = classObj;
	}
}
