import { MongoClient, Db } from 'mongodb';
import Express from 'express';
import bcrypt from 'bcrypt';

import { IUserModel } from '../../@core/interfaces';
import { Err } from '../../@core/errors';
import { generateToken } from '../../@core/utils/token_helpers';

export default class AuthRoot {
  db!: Db;
  connected = false;

  constructor() {
    this.connect();
  }

  async connect() {
    if(!this.db) {
      try {
        const mongoclient = new MongoClient(process.env.MD_PORT || '', { useUnifiedTopology: true });
  
        await mongoclient.connect()
        this.db = mongoclient.db('Users');
        } catch (err) {
        throw new Err.InternalError();
      }
    }
  }

  async getUserByEmail(email: string): Promise<IUserModel | null>  {
    return await this.db.collection('Users').findOne({ email });
  }

  async checkUserIsNoExist(email: string) {
    const user = await this.getUserByEmail(email);

    if (user) {
      throw new Err.UserAlreadyTakenError();
    }
  }

  getUserWithEncodePassword(user: IUserModel): IUserModel {
    return {
      ...user,
      password: bcrypt.hashSync(user.password + process.env.SECRET_KEY, 12),
    }
  }

  async sendUserToBase(user: IUserModel) {
    this.db.collection('Users').insertOne(user, function (err: any) {
  
      if (err) {
        throw new Err.InternalError();
      }
    });
  }
  
  returnResponseWithToken(res: Express.Response, email: string) {
    res.json({ token: generateToken(email)});
  }

  async getCreatedUser(email: string) {
    const user = await this.getUserByEmail(email);

    if(!user) {
      throw new Err.UnauthorizedError();
    }

    return user;
  }

  checkUserPassword(firstPassword: string, secondPassword: string) {
    const isPasswordEqual = bcrypt.compareSync(firstPassword+ process.env.SECRET_KEY, secondPassword);

    if(!isPasswordEqual) {
      throw new Err.UnauthorizedError();
    }
  }
}