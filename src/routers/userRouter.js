import express from "express";
import {
	see,
	logout,
	startGithubLogin,
	finishGithubLogin,
	getEdit,
	postEdit,
	getChangePassword,
	postChangePassword,
} from "../controllers/userController";
import {
	avatarUpload,
	protectorMiddleware,
	publicOnlyMiddleware,
} from "../middlewares";
const userRouter = express.Router();

userRouter
	.route("/edit")
	.all(protectorMiddleware)
	.get(getEdit)
	.post(avatarUpload.single("avatar"), postEdit);
userRouter
	.route("/change-password")
	.all(protectorMiddleware)
	.get(getChangePassword)
	.post(postChangePassword);
userRouter.get("/logout", protectorMiddleware, logout);
// \d+ : 숫자만 표시하는 정규식, 연습 예제에서 사용
// userRouter.get("/:id(\\d+)", see);
userRouter.get("/:id([0-9a-f]{24})", see);
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);

export default userRouter;
