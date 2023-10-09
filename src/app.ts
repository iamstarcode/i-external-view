import express, { Request, Response, NextFunction } from 'express';
import AppError from './utils/appError';
import globalErrorHandler from './controllers/errorController';
import morgan from 'morgan';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express'
const app = express();

// log morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// apply cors
app.use(cors());

// parse the body
app.use(express.json({ limit: '10kb' }));

import productRouter from './routes/productRoute';
import shopRouter from './routes/shopRoute';
import couponRouter from './routes/couponRoute';
import { swaggerSpec } from './utils/swagger';

app.use('/api/v1/shop', shopRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/coupon', couponRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/', (req, res) => {
  res.json({ message: 'api endpoint is working' });
});

app.use('/api/v1/', (req, res) => {
  res.json({ message: 'endpoint/api/v1 is working' });
});

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  const message: string = `${req?.originalUrl} route cannot be found on this server`;
  return next(new AppError(message, 404));
});

app.use(globalErrorHandler.globalSendError);

export default app;
