import express from 'express';
import apiRouter from './api.js';

const app = express();
const PORT = 3001;

app.use(apiRouter);

app.listen(PORT, () => {
  console.log(`Storage API running on port ${PORT}`);
});
