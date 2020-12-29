import axios from "axios";
import ConstantList from "../../appConfig";

export const getTeacherByUsername = (username) => {
  return axios.get(
    `${ConstantList.API_ENDPOINT}/teacher-by-username/${username}`
  );
};

export const getClassByTeacher = (teacherCode) => {
  return axios.get(
    `${ConstantList.API_ENDPOINT}/class-of-teacher/${teacherCode}`
  );
};

export const uploadFiles = (file, onUploadProgress, classCode) => {
  let formData = new FormData();

  formData.append("files", file);
  formData.append("classCode", classCode);

  return axios.post(
    `${ConstantList.API_ENDPOINT}/upload-rollcall-image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress,
    }
  );
};

export const saveImageToDB = (classObjCode) => {
  return axios.post(
    `${ConstantList.API_ENDPOINT}/save-rollcall-image/${classObjCode}`
  );
};

export const getStudentInClass = (classCode) => {
  return axios.get(
    `${ConstantList.API_ENDPOINT}/get-student-in-class/${classCode}`
  );
};

export const getRollCallDateList = (classCode) => {
  return axios.get(
    `${ConstantList.API_ENDPOINT}/get-rollcall-date-list/${classCode}`
  );
};

export const getDetailStudentInRollCall = (classCode, date) => {
  return axios.get(
    `${ConstantList.API_ENDPOINT}/get-detail-student-in-rollcall/${classCode}/${date}`
  );
};

export const updateStatusStudentInRollCall = (classCode, date, studentList) => {
  return axios.post(
    `${ConstantList.API_ENDPOINT}/update-status-student-in-rollcall/${classCode}/${date}`,
    studentList
  );
};
