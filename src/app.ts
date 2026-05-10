import express, { Request, Response } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import logger from '#config/logger.js';
import authRoutes from '#routes/auth.routes.js';
import { globalErrorHandler } from '#middleware/error.middleware.js';
import securityMiddleware from '#middleware/security.middleware.js';

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  morgan('combined', {
    stream: { write: message => logger.info(message.trim()) },
  })
);


app.use(securityMiddleware);


app.get('/', (req: Request, res: Response) => {
  logger.info('Hello from logger');
  res.status(200).send('Hello from Acquisitions!');
});

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.get('/api', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Acquisitons API running' });
});

app.use('/api/auth', authRoutes);

//Middlware to catch all the error
app.use(globalErrorHandler);

export default app;
