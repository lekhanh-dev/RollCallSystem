import axios from "axios";
import appConfig from "../../appConfig";

export const getSubjects = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/subjects`);
};

export const addSubject = (subject) => {
  return axios.post(`${appConfig.API_ENDPOINT}/subjects`, subject);
};

export const updateSubject = (subject) => {
  return axios.put(`${appConfig.API_ENDPOINT}/subjects`, subject);
};

export const deleteSubject = (subject) => {
  return axios.delete(`${appConfig.API_ENDPOINT}/subjects`, { data: subject });
};
