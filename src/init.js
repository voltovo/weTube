import "regenerator-runtime";
import "dotenv/config";
import "./db";
import "./models/Video";
import "./models/User";
import "./models/Comments";
import app from "./server";
const PORT = "4000";

const handleListening = () =>
  console.log(`✅ Server listenting on port ${PORT} 🚀`);
app.listen(PORT, handleListening);
