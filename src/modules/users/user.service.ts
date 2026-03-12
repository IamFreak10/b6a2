import db from '../../config/db';

const getUsers = async () => {
  const query = `SELECT * FROM users`;
  const result = await db.query(query);
  return result.rows;
};

const updateUser = async (id: string, updateData: any) => {
  const userId = parseInt(id);

  // যদি আইডি নাম্বার না হয়, তবে এরর থ্রো করবে
  if (isNaN(userId)) {
    throw new Error('Invalid User ID provided');
  }

  const fields = Object.keys(updateData);
  const values = Object.values(updateData);

  if (fields.length === 0) {
    throw new Error('No fields provided to update');
  }

  const setClause = fields
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');

  const query = `
    UPDATE users 
    SET ${setClause} 
    WHERE id = $${fields.length + 1} 
    RETURNING *;
  `;

  // এখানে সরাসরি userId (ইন্টিজার) পাস করুন
  const result = await db.query(query, [...values, userId]);
  return result.rows[0];
};

const deleteUser = async (id: string) => {
  const result = await db.query(`DELETE FROM users WHERE id=$1 RETURNING *`, [
    id,
  ]);
  return result.rows[0];
};
export const userService = {
  getUsers,
  updateUser,
  deleteUser,
};
