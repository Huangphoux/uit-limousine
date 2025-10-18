import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRouter from './presentation_layer/routes/auth.route.js'

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: ['https://uit-limousine.netlify.app', 'http://localhost:5173']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/auth', authRouter)

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', (error) => {
  if (error) throw error;
  console.log(`Listening to http://localhost:${PORT}`);
});

export default app