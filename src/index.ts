// Packages
import express from 'express';
import bodyparser from 'body-parser';

// Routes
import { usersRouter } from './routes/users';
import { loginRouter } from './routes/login';
import { reimbursementsRouter } from './routes/reimbursements';


import { Application } from 'express';

const PORT: number = 3000;
const app: Application = express();

app.use(bodyparser.json());

app.use('/login', loginRouter);
app.use('/users', usersRouter);
app.use('/reimbursements', reimbursementsRouter);

app.listen(PORT, () => {
  console.log(`App has started on port: ${PORT}`)
})