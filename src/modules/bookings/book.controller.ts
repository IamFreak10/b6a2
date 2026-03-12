import { Request, Response } from 'express';
import { bookingService } from './book.service';

const createBooking = async (req: Request, res: Response) => {
  try {
    const loggedInUser = req.user as any;
    const bookingData = {
      ...req.body,

      customer_id:
        loggedInUser.role === 'admin' ? req.body.customer_id : loggedInUser.id,
    };

    const result = await bookingService.createBooking(bookingData);

    return res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message || 'Failed to create booking',
    });
  }
};

const getBookings = async (req: Request, res: Response) => {
  const user = req.user as any;
  try {
    const result = await bookingService.getBookings(user);
    return res.status(200).json({
      success: true,
      message: 'Bookings fetched successfully',
      data: result,
    });
  } catch (e: any) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

const updateBooking = async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;
    const user = req.user as any;

    const result = await bookingService.updateBookingStatus(bookingId as string, user);

    let successMessage = 'Booking updated successfully';
    if (user.role === 'admin')
      successMessage = 'Vehicle marked as returned successfully';
    if (user.role === 'customer')
      successMessage = 'Booking cancelled successfully';

    return res.status(200).json({
      success: true,
      message: successMessage,
      data: result,
    });
  } catch (e: any) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};
export const bookingController = {
  createBooking,
  getBookings,
  updateBooking,
};
