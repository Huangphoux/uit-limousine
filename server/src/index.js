import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import { TokenRepositoryPostgree } from './infrastructure_layer/token.repository.postgree.js';
import { UserRepositoryPostgree } from './infrastructure_layer/user.repository.postgree.js';
import { LoginUseCase } from './application_layer/login.usecase.js';
import { createLoginRouter } from './presentation_layer/routes/login.route.js';

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors({
  origin: ['https://uit-limousine.netlify.app', 'http://localhost:5173']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up login route
const userRepo = new UserRepositoryPostgree();
const tokenRepo = new TokenRepositoryPostgree();
const loginUseCase = new LoginUseCase(userRepo, tokenRepo, process.env.JWT_SECRET || 'your-secret-key');
app.use('/', createLoginRouter(loginUseCase));

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.listen(PORT, '0.0.0.0', (error) => {
  if (error) throw error;
  console.log(`Listening to http://localhost:${PORT}`);
});