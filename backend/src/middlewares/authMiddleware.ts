import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface TokenPayload {
    id: number;
    email: string;
    iat: number;
    exp: number;
}

export interface AuthRequest extends Request {
    userId?: number;
    userEmail?: string;
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido' });
        return;
    }

    const parts = authHeader.split(' ');

    if (parts.length !== 2) {
        res.status(401).json({ error: 'Token mal formatado' });
        return;
    }

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme)) {
        res.status(401).json({ error: 'Token mal formatado' });
        return;
    }

    try {
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || 'default_secret'
        ) as TokenPayload;

        req.userId = decoded.id;
        req.userEmail = decoded.email;

        next();
    } catch (err) {
        res.status(401).json({ error: 'Token inválido' });
    }
};

export default authMiddleware;
