import dotenv from 'dotenv';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
dotenv.config({ path: path.join(process.cwd(), '.env') });
const config = {
  connecttion_string: process.env.CONNECTION_STRING,
  port: process.env.PORT,
  jwtsecret: process.env.JWT_SECRET,
};
export default config;
export { bcrypt, jwt };
