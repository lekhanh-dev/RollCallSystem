package com.rollcallsystem.model;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name = "student" )
public class Student {

	@Id
	@Column(length = 10)
    private String code;
	
	@Column(name = "name", length = 50, nullable = false)
    private String name;

	@Column(name = "user_id", unique = true)
	private Long user_id;
	
	@Column(name = "image", columnDefinition = "TEXT")
	private String imageList;
	
//	@OneToOne
//    @JoinColumn(name = "user_id", unique = true, nullable = false)
//	private User user;

	@ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(name = "student_classs",
            joinColumns = {@JoinColumn(name = "student_code")},
            inverseJoinColumns = {@JoinColumn(name = "classs_code")})
    private List<ClassObj> classObj;
	
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

	public List<ClassObj> getClassObj() {
		return classObj;
	}

	public void setClassObj(List<ClassObj> classObj) {
		this.classObj = classObj;
	}

	public Long getUser_id() {
		return user_id;
	}

	public void setUser_id(Long user_id) {
		this.user_id = user_id;
	}

	public String getImageList() {
		return imageList;
	}

	public void setImageList(String imageList) {
		this.imageList = imageList;
	}

//	public User getUser() {
//		return user;
//	}
//
//	public void setUser(User user) {
//		this.user = user;
//	} 
}
