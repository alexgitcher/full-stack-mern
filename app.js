import express from 'express';
import config from 'config';
import mongoose from 'mongoose';
import path from 'path';

import authRouter from './routes/auth.routes.js';
import linkRouter from './routes/link.routes.js';
import redirectRouter from './routes/redirect.routes.js';

const PORT = config.get('port') || 5000;
const MONGO_URI = config.get('mongoUri');

const app = express();

app.use(express.json({ extended: true }));

app.use('/api/auth', authRouter);
app.use('/api/link', linkRouter);
app.use('/t', redirectRouter);

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, 'client', 'build')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

async function start() {
  try {
    await mongoose.connect(MONGO_URI, {

    });
    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error(`Server error: ${error.message}`);
    process.exit(1);
  }
}

start();
