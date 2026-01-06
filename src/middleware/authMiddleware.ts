import { NextFunction, Request, Response } from "express";
import { auth as betterAuth } from '../lib/auth';

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                name: string;
                email: string;
                role: string;
                emailVerified: boolean;
            }
        }
    }
}

export enum UserRole {
    USER = "USER",
    ADMIN = "ADMIN"
}

// middleware
const authMiddleware = (...roles: UserRole[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.headers);
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers as Record<string, string>
            });
            // console.log(session);
            if (!session) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            if (!session.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: "Please verify your email to access this resource."
                });
            }

            req.user = {
                id: session.user.id,
                name: session.user.name,
                email: session.user.email,
                role: session.user.role!,
                emailVerified: session.user.emailVerified,
            }
            if (roles.length && !roles.includes(req.user?.role as UserRole)) {
                return res.status(403).json({
                    success: false,
                    messasge: "Forbidden!!! You don't have the permission to access"
                })
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}

export default authMiddleware;