import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { AuthorizationError } from './CustomError';
import { UserStore } from '../models/user';
import { json } from 'body-parser';

const store = new UserStore()

const verifyAuthToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization) {
      throw new AuthorizationError('Unauthorized!')
    }
    const authorizationHeader = req.headers.authorization as string;
    const token = authorizationHeader.split(' ')[1];
    const {id, username} = jwt.verify(token, process.env.TOKEN_SECRET as string) as JwtPayload;
    console.log(`id: ${id}`)
    console.log(`username: ${username}`)
    const authUser = await store.show(id)
    if (username !== authUser.username) {
      throw new AuthorizationError('Unauthorized!')
    }
    next();
  } catch (error) {
    res.status(401);
    if (error instanceof AuthorizationError) {
      res.json({
        name: error.name,
        message: error.message,
      });
    } else {
      res.json(error);
    }
  }
};

export default verifyAuthToken;
