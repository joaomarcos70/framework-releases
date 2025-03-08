import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { IUser } from '../interfaces/user';

dotenv.config();


export const decodeToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    jwt.verify(removeBearer(token), String(process.env.JWT_SECRET), (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = decoded as IUser;
        next();
    });
}

const removeBearer = (token: string): string => {
    return token.replace('Bearer ', '');
}
