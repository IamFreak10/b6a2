import cron from 'node-cron';
import db from '../config/db';

export const initCronJobs = () => {

  cron.schedule('0 0 * * *', async () => {
    console.log('--- System: Checking for expired bookings ---');
    try {
      await db.query('BEGIN');

      
      const expiredBookings = await db.query(
        "SELECT id, vehicle_id FROM bookings WHERE rent_end_date < CURRENT_DATE AND status = 'active'"
      );

      for (const booking of expiredBookings.rows) {
       
        await db.query("UPDATE bookings SET status = 'returned' WHERE id = $1", [booking.id]);
        
       
        await db.query("UPDATE vehicles SET availability_status = 'available' WHERE id = $1", [booking.vehicle_id]);
      }

      await db.query('COMMIT');
      
      if (expiredBookings.rows.length > 0) {
        console.log(`--- System: ${expiredBookings.rows.length} bookings auto-marked as returned ---`);
      }
    } catch (err) {
      await db.query('ROLLBACK');
      console.error('--- System: Cron job failed ---', err);
    }
  });
};