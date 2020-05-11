import express from 'express';
import bodyparser from 'body-parser';

import {Application, Request, Response} from 'express';

const PORT: number = 3000;
const app: Application = express();

app.use(bodyparser.json());

app.post('/login', (req: Request, res: Response) => {
  let { username, password } : { username: string, password: string} = req.body;
  // I'm getting the username and password
  console.log(
`Username: ${username}
Password: ${password}`)
  // Need to confirm that the username and password match what our database says
  let usernameExists: boolean = true;
  if (usernameExists) {
    let passwordCorrect: boolean = true;
    if (passwordCorrect) {
      // 'OK'
      res.send('User').status(200);
      // I'm guessing we would want to reroute to a new page 
      // 'continue' res.status(200);
    } else {
      res.send("Invalid Credentials").status(400);
    }
  } else {
    //? Not found 404
    res.send("Invalid Credentials").status(400);
  }
})

app.listen(PORT, () => {
  console.log(`App has started on port: ${PORT}`)
})