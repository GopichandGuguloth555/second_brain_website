import { NextFunction, Request, Response } from 'express';
import jwt from "jsonwebtoken";
import { JWTSECRET } from './config';

export const userMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"];

    if (!header) {
        res.status(401).json({
            message: "You must login to continue"
        });
        return;
    }

    try {
        const decoded = jwt.verify(header, JWTSECRET) as { id: string };
        //@ts-ignore
        req.userId = decoded.id;
        next();
    } catch (err) {
        if (err instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: "Session expired. Please login again."
            });
            return;
        }

        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
