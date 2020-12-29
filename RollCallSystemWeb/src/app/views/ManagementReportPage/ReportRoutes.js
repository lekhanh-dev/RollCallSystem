import { MatxLoadable } from "matx";
import { authRoles } from "../../auth/authRoles";

const Report = MatxLoadable({
  loader: () => import("./ReportPage"),
});

const reportRoutes = [
  {
    path: "/management/report",
    component: Report,
    auth: authRoles.sa,
  },
];

export default reportRoutes;
