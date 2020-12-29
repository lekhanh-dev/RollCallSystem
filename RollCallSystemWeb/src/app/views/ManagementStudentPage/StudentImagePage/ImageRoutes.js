import { MatxLoadable } from "matx";
import { authRoles } from "../../../auth/authRoles";

const ImagePage = MatxLoadable({
  loader: () => import("./ImagePage"),
});

const imageRoutes = [
  {
    path: "/management/students/image/",
    component: ImagePage,
    auth: authRoles.sa,
  },
];

export default imageRoutes;
