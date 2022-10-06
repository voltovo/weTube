import express from "express";
import logger from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = "4000";
const app = express();
app.use(logger("dev"));

app.use("/videos", videoRouter);
app.use("/users", userRouter);
app.use("/", globalRouter);

const handleListening = () =>
	console.log(`✅ Server listenting on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
