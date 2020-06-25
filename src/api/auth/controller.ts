import Express from 'express';

import AuthRoot from './root';
import { validateSignUpBody, validateSignInBody } from './helpers';

class AuthController extends AuthRoot {
  public signUp = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      validateSignUpBody(req.body);

      await this.connect();
      await this.checkUserIsNoExist(req.body.email);
      const encryptedUser = this.getUserWithEncodePassword(req.body);
      await this.sendUserToBase(encryptedUser);
      this.returnResponseWithToken(res, req.body.email);
    } catch (error) {
      next(error);
    }
  }

  public signIn = async (req: Express.Request, res: Express.Response, next: Express.NextFunction) => {
    try {
      validateSignInBody(req.body);

      await this.connect()
      const user = await this.getCreatedUser(req.body.email);
      await this.checkUserPassword(user.password, req.body.password);
      await this.returnResponseWithToken(res, req.body.email);
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();