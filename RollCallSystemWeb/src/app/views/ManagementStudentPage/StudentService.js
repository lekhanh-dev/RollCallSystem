import axios from "axios";
import appConfig from "../../appConfig";

export const getStudents = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/students`);
};

export const addStudents = (student) => {
  return axios.post(`${appConfig.API_ENDPOINT}/students`, student);
};

export const updateStudents = (student) => {
  return axios.put(`${appConfig.API_ENDPOINT}/students`, student);
};

export const createStudentAccount = (student) => {
  console.log(student);
  return axios.post(
    `${appConfig.API_ENDPOINT}/student/create-account/${student.code}`,
    student
  );
};

export const deleteStudents = (student) => {
  return axios.delete(`${appConfig.API_ENDPOINT}/students`, { data: student });
};
