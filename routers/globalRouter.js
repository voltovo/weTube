import express from "express";
import { Join, Login, Logout } from "../controllers/userController";
import { home, search } from "../controllers/videoController";
import routes from "../routes";

const globalRouter = express.Router();

globalRouter.get(routes.home, home);
globalRouter.get(routes.search, search);
globalRouter.get(routes.join, Join);
globalRouter.get(routes.login, Login);
globalRouter.get(routes.logout, Logout);

export default globalRouter;