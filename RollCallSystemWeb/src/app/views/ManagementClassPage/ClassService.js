import axios from "axios";
import appConfig from "../../appConfig";

export const getClass = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/class`);
};

export const addClass = (classObj) => {
  return axios.post(`${appConfig.API_ENDPOINT}/class`, classObj);
};

export const updateClass = (classObj) => {
  return axios.put(`${appConfig.API_ENDPOINT}/class`, classObj);
};

export const deleteClass = (classObj) => {
  return axios.delete(`${appConfig.API_ENDPOINT}/class`, { data: classObj });
};

export const addSchedule = (schedule, classCode) => {
  return axios.post(
    `${appConfig.API_ENDPOINT}/schedule/${classCode}`,
    schedule
  );
};

export const getSchedule = (scheduleId) => {
  return axios.get(`${appConfig.API_ENDPOINT}/schedule/${scheduleId}`);
};

export const getTeacherForClass = (classCode) => {
  return axios.get(`${appConfig.API_ENDPOINT}/teacher-for-class/${classCode}`);
};

export const addTeacherForClass = (obj) => {
  return axios.post(`${appConfig.API_ENDPOINT}/teacher-for-class`, obj);
};

export const getStudentByClass = (classObj) => {
  return axios.get(`${appConfig.API_ENDPOINT}/student-by-class/${classObj}`);
};

export const getStudentInClass = (classObj) => {
  return axios.get(`${appConfig.API_ENDPOINT}/student-in-class/${classObj}`);
};

export const getClassByCode = (classObj) => {
  return axios.get(`${appConfig.API_ENDPOINT}/class-by-code/${classObj}`);
};

export const addStudentToClass = (classObj, studentCodeList) => {
  return axios.post(
    `${appConfig.API_ENDPOINT}/add-student-to-class/${classObj}`,
    studentCodeList
  );
};
