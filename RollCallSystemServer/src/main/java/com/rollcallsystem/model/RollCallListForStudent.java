package com.rollcallsystem.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "RollCallListForStudent" )
public class RollCallListForStudent {

	@Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
	
	@Column(name = "student_code", nullable = false, length = 10)
    private String studentCode;
	
	@Column(name = "status")
    private Long status;
	
	@ManyToOne
    @JoinColumn(name = "RollCallListForClass_id")
    private RollCallListForClass rollCallListForClass;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getStudentCode() {
		return studentCode;
	}

	public void setStudentCode(String studentCode) {
		this.studentCode = studentCode;
	}

	public RollCallListForClass getRollCallListForClass() {
		return rollCallListForClass;
	}

	public void setRollCallListForClass(RollCallListForClass rollCallListForClass) {
		this.rollCallListForClass = rollCallListForClass;
	}

	public Long getStatus() {
		return status;
	}

	public void setStatus(Long status) {
		this.status = status;
	}
}
