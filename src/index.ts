import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import frameworkRoutes from './routes/frameworkRoutes';
import { IUser } from './interfaces/user';

import updateFrameworksJob from './tasks/update-frameworks';

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/framework-releases';

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', frameworkRoutes);

updateFrameworksJob();

// Conexão com MongoDB
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Conectado ao MongoDB');
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
  }); 