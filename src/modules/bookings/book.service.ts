import db from '../../config/db';

const createBooking = async (payload: any) => {
  const { customer_id, vehicle_id, rent_start_date, rent_end_date } = payload;

  const vehicle = await db.query(
    'SELECT daily_rent_price, availability_status FROM vehicles WHERE id = $1',
    [vehicle_id]
  );

  if (
    vehicle.rows.length === 0 ||
    vehicle.rows[0].availability_status !== 'available'
  ) {
    throw new Error('Vehicle is not available for booking');
  }

  const start = new Date(rent_start_date);
  const end = new Date(rent_end_date);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  const total_price = diffDays * vehicle.rows[0].daily_rent_price;

  try {
    await db.query('BEGIN');

    const bookingResult = await db.query(
      `INSERT INTO bookings (customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status)
       VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *`,
      [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price]
    );

    await db.query(
      'UPDATE vehicles SET availability_status = $1 WHERE id = $2',
      ['booked', vehicle_id]
    );

    await db.query('COMMIT');

    return {
      ...bookingResult.rows[0],
      vehicle: {
        vehicle_name: vehicle.rows[0].name,
        daily_rent_price: vehicle.rows[0].daily_rent_price,
      },
    };
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};

const getBookings = async (user: any) => {
  const isAdmin = user.role === 'admin';
  const userId = parseInt(user.id);

  let query = `
    SELECT 
      b.id, 
      b.customer_id, 
      b.vehicle_id, 
      b.rent_start_date, 
      b.rent_end_date, 
      b.total_price, 
      b.status,
      u.name as customer_name, 
      u.email as customer_email,
      v.vehicle_name, 
      v.registration_number, 
      v.type as vehicle_type
    FROM bookings b
    LEFT JOIN users u ON b.customer_id = u.id
    LEFT JOIN vehicles v ON b.vehicle_id = v.id
  `;

  const params = [];

  if (!isAdmin) {
    query += ` WHERE b.customer_id = $1`;
    params.push(userId);
  }

  const result = await db.query(query, params);

  return result.rows.map((row) => {
    if (isAdmin) {
      return {
        id: row.id,
        customer_id: row.customer_id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        customer: {
          name: row.customer_name,
          email: row.customer_email,
        },
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
        },
      };
    } else {
      return {
        id: row.id,
        vehicle_id: row.vehicle_id,
        rent_start_date: row.rent_start_date,
        rent_end_date: row.rent_end_date,
        total_price: row.total_price,
        status: row.status,
        vehicle: {
          vehicle_name: row.vehicle_name,
          registration_number: row.registration_number,
          type: row.vehicle_type,
        },
      };
    }
  });
};

const updateBookingStatus = async (bookingId: string, user: any) => {
  const isAdmin = user.role === 'admin';
  const userId = user.id;

  const bookingResult = await db.query('SELECT * FROM bookings WHERE id = $1', [
    bookingId,
  ]);
  const booking = bookingResult.rows[0];

  if (!booking) {
    throw new Error('Booking not found');
  }

  try {
    await db.query('BEGIN');

    if (user.role === 'customer') {
      if (booking.customer_id !== userId) {
        throw new Error('Unauthorized: You can only cancel your own bookings');
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(booking.rent_start_date);
      startDate.setHours(0, 0, 0, 0);

      if (today >= startDate) {
        throw new Error(
          'Cannot cancel: Rental period has already started or is today'
        );
      }

      await db.query("UPDATE bookings SET status = 'cancelled' WHERE id = $1", [
        bookingId,
      ]);
      await db.query(
        "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
        [booking.vehicle_id]
      );
    } else if (isAdmin) {
      await db.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [
        bookingId,
      ]);
      await db.query(
        "UPDATE vehicles SET availability_status = 'available' WHERE id = $1",
        [booking.vehicle_id]
      );
    }

    await db.query('COMMIT');

    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [
      bookingId,
    ]);
    return result.rows[0];
  } catch (error) {
    await db.query('ROLLBACK');
    throw error;
  }
};
export const bookingService = {
  createBooking,
  getBookings,
  updateBookingStatus,
};
