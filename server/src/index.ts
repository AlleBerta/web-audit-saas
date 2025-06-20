import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import config from './config/config';
import { db } from '@api/v1/models';
import userRoutes from '@api/v1/routes/UserRoutes';
import projectRouter from '@api/v1/routes/ProjectRoutes';
import { errorHandler } from '@api/v1/middlewares/errorHandler';
import deserializeUser from '@api/v1/middlewares/deserializeUser';

const port = Number(config.SERVER_PORT);
const client_port = Number(config.CLIENT_PORT);

const app = express();
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({
    origin: `http://localhost:${client_port}`,
    credentials: true,
  })
);
// routes
app.use('/user', userRoutes);

app.use(deserializeUser);
// Routes protette
// Projects, etc...

// middlewares
app.use(errorHandler); // Gestisce gli errori

app.use('/project', projectRouter);
// Prima di avviare il server, sincronizziamo il DB
db.sequelize
  .sync() // { alter: true } per modificare, { force: true } per drop+create
  .then(() => {
    console.log('✅ Database synchronized');
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Unable to sync database:', err);
  });

/**
   * Implementaizone cors + helmet
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

// Helmet per header di sicurezza
app.use(helmet());

// CORS: permetti richieste dal frontend su un'altra porta
app.use(cors({
  origin: 'http://localhost:5000', // o '*' solo per sviluppo
  credentials: true, // se usi cookie o Authorization header
}));

// Middleware standard
app.use(express.json());

// Aggiungi le tue route
app.get('/api/test', (req, res) => {
  res.json({ message: 'CORS e Helmet funzionano!' });
});

export default app;

  */
