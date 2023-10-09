import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import app from './app';

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server has started on port ${port}`);
});
