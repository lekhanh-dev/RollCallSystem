import axios from "axios";
import appConfig from "../../appConfig";

export const getSemesters = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/semesters`);
};

export const addSemester = (semester) => {
  return axios.post(`${appConfig.API_ENDPOINT}/semesters`, semester);
};

export const updateSemester = (semester) => {
  return axios.put(`${appConfig.API_ENDPOINT}/semesters`, semester);
};

export const deleteSemester = (semester) => {
  return axios.delete(`${appConfig.API_ENDPOINT}/semesters`, {
    data: semester,
  });
};
