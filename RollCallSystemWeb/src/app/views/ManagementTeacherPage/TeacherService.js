import axios from "axios";
import appConfig from "../../appConfig";

export const getTeachers = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/teachers`);
};

export const addTeachers = (teacher) => {
  return axios.post(`${appConfig.API_ENDPOINT}/teachers`, teacher);
};

export const updateTeachers = (teacher) => {
  return axios.put(`${appConfig.API_ENDPOINT}/teachers`, teacher);
};

export const createTeacherAccount = (teacher) => {
  console.log(teacher);
  return axios.post(
    `${appConfig.API_ENDPOINT}/teacher/create-account/${teacher.code}`,
    teacher
  );
};

export const deleteTeachers = (teacher) => {
  return axios.delete(`${appConfig.API_ENDPOINT}/teachers`, { data: teacher });
};
