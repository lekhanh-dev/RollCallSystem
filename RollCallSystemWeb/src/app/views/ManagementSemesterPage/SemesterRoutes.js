import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Semester = MatxLoadable({
  loader: () => import("./SemesterPage"),
});

const semesterRoutes = [
  {
    path: "/management/semesters",
    component: Semester,
    auth: authRoles.sa,
  },
];

export default semesterRoutes;
