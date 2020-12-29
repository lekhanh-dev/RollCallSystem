package com.rollcallsystem.service;

import java.sql.Date;

import com.rollcallsystem.model.ClassObj;
import com.rollcallsystem.model.RollCallListForClass;

public interface RollCallListForClassService {
	void save(RollCallListForClass rollCallListForClass);
	RollCallListForClass findByExmaple(Date date, ClassObj classObj);
}
