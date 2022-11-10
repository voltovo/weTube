import express from "express";
import logger from "morgan";
import session from "express-session";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const app = express();

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(session({ secret: "Hello!", resave: true, saveUninitialized: true }));

app.use("/", rootRouter);
app.use("/videos", videoRouter);
app.use("/users", userRouter);

export default app;
