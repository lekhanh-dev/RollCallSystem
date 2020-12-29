import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Subject = MatxLoadable({
  loader: () => import("./SubjectPage"),
});

const subjectRoutes = [
  {
    path: "/management/subjects",
    component: Subject,
    auth: authRoles.sa,
  },
];

export default subjectRoutes;
