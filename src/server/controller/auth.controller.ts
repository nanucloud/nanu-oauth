import { Request, Response } from 'express';
import { AppDataSource } from '../config/datasource';
import { User } from '../entities/user.entity';
import { LoginUserRequest, JoinUserRequest, AuthResponse } from '../dto/auth';
import { hashPassword, verifyPassword } from '../utils/passwordAuth';
import { jwtPayload } from '../dto/jwt';
import jwt from 'jsonwebtoken';
import { JWT_KEY } from '../config/systemkeys';
import { RecaptchaVerify } from '../utils/googleCaptcha';

const userRepository = AppDataSource.getRepository(User);

export const LoginUser = async (req: Request, res: Response) => {
  try {
    const loginRequest: LoginUserRequest = req.body;
    if (!RecaptchaVerify(loginRequest.google_recaptcha)) return res.status(400).json({ message: 'Not Vaild Request' });
    const user = await userRepository.findOne({ where: { user_email: loginRequest.user_email } });

    if (!user || !(await verifyPassword(loginRequest.user_password, user.user_password))) {
      return res.status(404).json({ message: 'Please Check Your Password or ID' });
    }
    const payload: jwtPayload = {
      user_id: user.user_id,
      user_email: user.user_email,
    }
    const Response: AuthResponse = {
      payload: jwt.sign(payload, JWT_KEY, { expiresIn: '1h' }),
    };
    return res.status(200).json(Response);
  } catch (err) {
    return res.status(500);
  }
}

export const JoinUser = async (req: Request, res: Response) => {
  try {
    const joinRequest: JoinUserRequest = req.body;
    if (!RecaptchaVerify(joinRequest.google_recaptcha)) return res.status(400).json({ message: 'Not Vaild Request' });
    const user = await userRepository.findOne({ where: { user_email: joinRequest.user_email } });
    if (user) return res.status(400).json({ "message": "이미 있는 사용자" })
    const hashedPassword = await hashPassword(joinRequest.user_password);

    const newUser = userRepository.create({ //신 유저 생성
      ...joinRequest,
      user_password: hashedPassword,
    });
    await userRepository.save(newUser);

    const payload: jwtPayload = {
      user_id: newUser.user_id,
      user_email: newUser.user_email,
    }
    const Response: AuthResponse = {
      payload: jwt.sign(payload, JWT_KEY, { expiresIn: '1h' }),
    };
    return res.status(200).json(Response);
  } catch (err) {
    return res.status(500);
  }
}