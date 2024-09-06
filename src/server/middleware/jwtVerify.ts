import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken'
import { jwtPayload } from "../dto/jwt";
import { JWT_KEY, ADMIN_EMAIL } from "../config/systemkeys";

export const USER_PROTECT = (req: Request, res: Response, next: NextFunction) => {
    const authroize_header = req.headers.authorization;
    if (!authroize_header || !authroize_header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'unauthorized' })
    }

    const token = authroize_header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_KEY) as jwtPayload
        req.query.__email = decoded.user_email

        next();
    } catch (err) {
        return res.status(401).json({ message: 'unauthorized' })
    }
}

export const ADMIN_PROTECT = (req: Request, res: Response, next: NextFunction) => {
    const authroize_header = req.headers.authorization;
    if (!authroize_header || !authroize_header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'unauthorized' })
    }

    const token = authroize_header.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_KEY) as jwtPayload
        req.query.__email = decoded.user_email;
        console.log(decoded.user_email)
        console.log(ADMIN_EMAIL)
        if (!(req.query.__email == ADMIN_EMAIL)) {
            return res.status(401).json({ message: 'unauthorized ㅗ' })
        }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'unauthorized' })
    }
}