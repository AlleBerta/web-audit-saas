import config from './config/config';
import express from 'express';
import { db } from '@api/v1/models';

const app = express();
const port = Number(config.PORT) || 3000;

// (Qui middleware, routes, ecc.)

// Prima di avviare il server, sincronizziamo il DB
db.sequelize
  .sync({ alter: true }) // o { force: true } per drop+create
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
