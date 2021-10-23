import dotenv from 'dotenv';
dotenv.config();

import app from './main/app';

app.listen(3000, () => {
  console.log('Server Running...');
});
