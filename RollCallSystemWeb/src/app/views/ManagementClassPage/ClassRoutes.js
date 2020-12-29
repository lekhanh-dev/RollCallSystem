import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Class = MatxLoadable({
  loader: () => import("./ClassPage"),
});

const addStudentToClass = MatxLoadable({
  loader: () => import("./AddStudentToClassPage"),
});

const classRoutes = [
  {
    path: "/management/class",
    component: Class,
    auth: authRoles.sa,
  },

  {
    path: "/management/add-student-to-class",
    component: addStudentToClass,
    auth: authRoles.sa,
  },
];

export default classRoutes;
