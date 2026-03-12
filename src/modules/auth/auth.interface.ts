interface IUser {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'user';
}
export default IUser;
