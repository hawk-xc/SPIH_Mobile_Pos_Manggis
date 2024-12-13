import { format } from 'date-fns';
import { toDate } from 'date-fns-tz';
import dotenv from 'dotenv';
dotenv.config();

const timeZone = process.env.TIMEZONE;

const formattedDate = () => {
  const now = new Date(); // Waktu UTC
  const zonedDate = toDate(now, { timeZone }); // Konversi ke WIB
  return format(zonedDate, 'yyyy-MM-dd HH:mm:ss'); // Format untuk SQL
};

export default formattedDate;