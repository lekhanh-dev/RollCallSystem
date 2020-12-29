import axios from "axios";
import appConfig from "../../appConfig";

export const getAllClass = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/class`);
};

export const getDetailStudentInClass = (classCode) => {
  return axios.get(
    `${appConfig.API_ENDPOINT}/get-detail-student-in-class/${classCode}`
  );
};

export const exportFileExcel = (classCode) => {
  return axios.post(
    `${appConfig.API_ENDPOINT}/export-file-excel/${classCode}/data.xlsx/`,
    classCode,
    {
      responseType: "blob",
    }
  );
};
