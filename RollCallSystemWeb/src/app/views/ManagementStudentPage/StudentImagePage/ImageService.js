import axios from "axios";
import appConfig from "../../../appConfig";

export const getStudent = (studentCode) => {
  return axios.get(`${appConfig.API_ENDPOINT}/student/${studentCode}`);
};

export const uploadFiles = (file, onUploadProgress, studentCode) => {
  let formData = new FormData();

  formData.append("files", file);
  formData.append("studentCode", studentCode);
  console.log(file);

  return axios.post(
    `${appConfig.API_ENDPOINT}/upload-student-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );
};

export const saveFileName = (studentCode) => {
  return axios.post(`${appConfig.API_ENDPOINT}/save-file-name/${studentCode}`);
};

export const trainingData = () => {
  return axios.get(`${appConfig.API_ENDPOINT}/training-data`);
};

export const getFiles = (studentCode) => {
  return axios.get(`${appConfig.API_ENDPOINT}/files/${studentCode}`);
};

export const deleteImage = (imageName, studentCode) => {
  return axios.delete(
    `${appConfig.API_ENDPOINT}/image/${studentCode}/${imageName}`
  );
};
