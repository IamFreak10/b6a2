import express, { Request, Response } from 'express';
import { authRoutes } from './modules/auth/auth.routes';
import { vehiclesRoutes } from './modules/vehicles/vehicles.routes';
import { userRoutes } from './modules/users/user.routes';
import { bookingRoutes } from './modules/bookings/book.routes';
import { initCronJobs } from './utils/cronJobs';

export const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// !Auto-mark as "returned" when period ends Booking theke
initCronJobs();

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/vehicles', vehiclesRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.get('/', (req: Request, res: Response) => {
  res.send('hello world');
});

export default app;
