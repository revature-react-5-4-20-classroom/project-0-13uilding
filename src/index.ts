// Packages
import express from 'express';
import bodyparser from 'body-parser';
import dotenv from 'dotenv';
// This must go above connection pool or we won't have our environment variables
dotenv.config();

// Routes
import { usersRouter } from './routes/users';
import { loginRouter } from './routes/login';
import { reimbursementsRouter } from './routes/reimbursements';



import { Application } from 'express';
import { connectionPool } from './repository';
import { PoolClient, QueryResult } from 'pg';
import { sessionMiddleware } from './middleware/sessionMiddleware';


const PORT: number = 3000;
const app: Application = express();

app.use(bodyparser.json());
app.use(sessionMiddleware);

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter);

app.listen(PORT, () => {
  console.log(`App has started on port: ${PORT}`);
  // Here we connect to our DB
  connectionPool.connect().then(
    (client: PoolClient) => {
      console.log(`Connected to Database: ${process.env.PG_DATABASE}`)
      client && client.release();
    }).catch((err: Error) => {
      console.error(err.message);
    });
})