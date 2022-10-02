import express from "express";

const PORT = "4000";
const app = express();

const middleWare = (req, res, next) => {
	console.log(`Someone is going to : ${req.url}`);
	next();
};

const handleHome = (req, res) => {
	return res.send(`Someone is going to : ${req.url}`);
};

app.get("/", middleWare, handleHome);

const handleListening = () =>
	console.log(`✅ Server listenting on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
