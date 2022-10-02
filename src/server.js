import express from "express";

const PORT = "4000";
const app = express();

const logger = (req, res, next) => {
	console.log(`${req.method} : ${req.url}`);
	next();
};

const privateMiddleware = (req, res, next) => {
	const url = req.url;
	if (url === "/protected") res.send("<h1>NOT ALLOWED</h1>");

	next();
};

const handleHome = (req, res) => {
	return res.send(`Someone is going to : ${req.url}`);
};

app.use(logger);
app.use(privateMiddleware);
app.get("/", handleHome);

const handleListening = () =>
	console.log(`✅ Server listenting on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
