import app from './app';
import config from './config';
import db from './config/db';
const port = config.port;




app.listen(port, () => {
  console.log(`Server is runnig in port ${port}`);
});
