import express from "express";

const PORT = "4000";
const app = express();

const handleHome = (req, res) => {
	return res.send("I still hungry !");
};

const handleLogin = (req, res) => {
	return res.send("Login here !");
};

app.get("/", handleHome);
app.get("/login", handleLogin);

const handleListening = () =>
	console.log(`✅ Server listenting on port ${PORT} 🚀`);

app.listen(PORT, handleListening);
