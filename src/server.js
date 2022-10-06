import express from "express";
import logger from "morgan";

const PORT = "4000";
const app = express();
app.use(logger("dev"));

const globalRouter = express.Router();
const handleHome = (req, res) => res.send("HOME");

globalRouter.get("/", handleHome);
const userRouter = express.Router();
const handleEditUser = (req, res) => res.send("Edit user");

userRouter.get("/edit", handleEditUser);
const videoRouter = express.Router();
const handleWatchVideo = (req, res) => res.send("Watch Video");

videoRouter.get("/watch", handleWatchVideo);

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", globalRouter);

const handleListening = () =>
	console.log(`✅ Server listenting on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
