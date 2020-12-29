import React from "react";
import { Redirect } from "react-router-dom";

import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import utilitiesRoutes from "./views/utilities/UtilitiesRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";

import materialRoutes from "./views/material-kit/MaterialRoutes";
import dragAndDropRoute from "./views/Drag&Drop/DragAndDropRoute";

import formsRoutes from "./views/forms/FormsRoutes";
import mapRoutes from "./views/map/MapRoutes";
import subjectRoutes from "./views/ManagementSubjectPage/SubjectRoutes";
import semesterRoutes from "./views/ManagementSemesterPage/SemesterRoutes";
import teacherRoutes from "./views/ManagementTeacherPage/TeacherRoutes";
import studentRoutes from "./views/ManagementStudentPage/StudentRoutes";
import imageRoutes from "./views/ManagementStudentPage/StudentImagePage/ImageRoutes";
import classRoutes from "./views/ManagementClassPage/ClassRoutes";
import ReportRoutes from "./views/ManagementReportPage/ReportRoutes";

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/dashboard/analytics" />,
  },
];

const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />,
  },
];

const routes = [
  ...ReportRoutes,
  ...classRoutes,
  ...imageRoutes,
  ...studentRoutes,
  ...teacherRoutes,
  ...semesterRoutes,
  ...subjectRoutes,
  ...sessionRoutes,
  ...dashboardRoutes,
  ...materialRoutes,
  ...utilitiesRoutes,
  ...dragAndDropRoute,
  ...formsRoutes,
  ...mapRoutes,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
