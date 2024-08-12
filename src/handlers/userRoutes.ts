import express, { Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import jwt from 'jsonwebtoken';
import verifyAuthTokenMiddleware from '../util/verifyAuthTokenMiddleware';

const store = new UserStore();

const index = async (req: Request, res: Response) => {
  const users = await store.index();
  res.json(users);
};

const show = async (req: Request, res: Response) => {
  const user = await store.show(req.params.id);
  res.json(user);
};

const create = async (req: Request, res: Response) => {
  try {
    const user: User = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      username: req.body.username,
      password: req.body.password,
    };
    const newUser = await store.create(user);
    const token = jwt.sign(
      { username: req.body.username },
      process.env.TOKEN_SECRET as string,
    );

    res.json(token);
  } catch (error) {
    res.status(400);
    res.json(error);
  }
};

const authenticate = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    const loggedInUser = await store.authenticate(username, password);
    if (!loggedInUser) {
      throw new Error('Incorrect username or password!');
    } else {
      const token = jwt.sign(
        loggedInUser,
        process.env.TOKEN_SECRET as string,
      );
      res.json(token);
    }
  } catch (error) {
    res.status(401);
    res.json(error);
  }
};

const userRoutes = (app: express.Application) => {
  app.get('/users', index);
  app.get('/users/:id', verifyAuthTokenMiddleware, show);
  app.post('/users', verifyAuthTokenMiddleware, create);
  app.post('/authenticate', authenticate);
};

export default userRoutes;
