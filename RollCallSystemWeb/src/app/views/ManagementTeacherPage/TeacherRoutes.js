import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Teacher = MatxLoadable({
  loader: () => import("./TeacherPage"),
});

const teacherRoutes = [
  {
    path: "/management/teachers",
    component: Teacher,
    auth: authRoles.sa,
  },
];

export default teacherRoutes;
