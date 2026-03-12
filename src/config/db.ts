import { Pool } from 'pg';
import config from '.';

const db = new Pool({
  connectionString: `${config.connecttion_string}`,
});

export default db;
