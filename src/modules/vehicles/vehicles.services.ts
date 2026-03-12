import db from '../../config/db';

const createVehicle = async (payload: any) => {
  const {
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  } = payload;

  const query = `
    INSERT INTO vehicles (
      vehicle_name, 
      type, 
      registration_number, 
      daily_rent_price, 
      availability_status
    ) 
    VALUES ($1, $2, $3, $4, $5) 
    RETURNING *;
  `;

  const values = [
    vehicle_name,
    type,
    registration_number,
    daily_rent_price,
    availability_status,
  ];

  const result = await db.query(query, values);
  return result.rows[0];
};

const getVehicles = async () => {
  const query = `
  SELECT * FROM vehicles
  `;
  const result = await db.query(query);
  return result.rows[0];
};

const getVehicle = async (id: string) => {
  const query = `SELECT * FROM vehicles where id=$1`;
  const result = await db.query(query, [id]);
  return result.rows[0];
};

const updateVehicle = async (id: string, body: any) => {
  const { daily_rent_price, availability_status } = body;
  const query = `UPDATE vehicles 
SET 
  daily_rent_price = $1, 
  availability_status = $2 
WHERE id = $3 
RETURNING *;`;

  const result = await db.query(query, [
    daily_rent_price,
    availability_status,
    id,
  ]);
  return result.rows[0];
};

const deletVehicle = async (id: string) => {
  const result = await db.query(
    `DELETE FROM vehicles WHERE id=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
export const vehiclesService = {
  createVehicle,
  getVehicles,
  getVehicle,
  updateVehicle,
  deletVehicle,
};
