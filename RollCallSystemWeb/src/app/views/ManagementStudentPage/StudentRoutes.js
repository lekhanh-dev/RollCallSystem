import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Student = MatxLoadable({
  loader: () => import("./StudentPage"),
});

const studentRoutes = [
  {
    path: "/management/students",
    component: Student,
    auth: authRoles.sa,
  },
];

export default studentRoutes;
