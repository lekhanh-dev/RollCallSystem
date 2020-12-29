package com.rollcallsystem.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "TimeForSchedule" )
public class TimeForSchedule {

	@Id
	@Column(name = "name")
    private Long name;
	
	@Column(name = "timeStart", nullable = false)
    private String timeStart;
	
	@Column(name = "timeEnd", nullable = false)
    private String timeEnd;

	public Long getName() {
		return name;
	}

	public void setName(Long name) {
		this.name = name;
	}

	public String getTimeStart() {
		return timeStart;
	}

	public void setTimeStart(String timeStart) {
		this.timeStart = timeStart;
	}

	public String getTimeEnd() {
		return timeEnd;
	}

	public void setTimeEnd(String timeEnd) {
		this.timeEnd = timeEnd;
	}
	
	
}
