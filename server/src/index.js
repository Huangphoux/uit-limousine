import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = process.env.PORT || 3000;

app.listen(PORT, '0.0.0.0', (error) => {
  if (error) throw error;
  console.log(`Listening to http://localhost:${PORT}`);
});