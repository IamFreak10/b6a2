import IUser from './auth.interface';
import config, { bcrypt, jwt } from '../../config';
import db from '../../config/db';

const signUp = async (payload: IUser) => {
  const { name, email, password, phone, role } = payload;

  const hashedPassword = await bcrypt.hash(password, 10);
  const res = await db.query(
    `
  INSERT INTO users (name,email,password,role,phone)

  VALUES ($1,$2,$3,$4,$5) RETURNING id, name, email, role, phone, created_at
  
  `,
    [name, email, hashedPassword, role, phone]
  );

  return res.rows[0];
};

const signIn = async (email: string, password: string) => {
  const result = await db.query(
    `
        SELECT * FROM users WHERE email=$1`,
    [email]
  );

  if (result.rows.length === 0) {
    return null;
  }
  const user = result.rows[0];

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return null;
  }

  const token = jwt.sign(
    {
      name: user.name,
      email: user.email,
      id: user.id,
      role: user.role,
    },
    config.jwtsecret as string,
    {
      expiresIn: '1d',
    }
  );
  
  return { token, user };
};
export const authService = {
  signUp,
  signIn,
};
