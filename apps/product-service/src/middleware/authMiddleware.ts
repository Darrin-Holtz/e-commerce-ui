import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

declare global {
    namespace Express {
        interface Request {
            userId?: string
        }
    }
}

export const shouldBeUser = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req)
    const userId = auth.userId

    if (!userId) {
        return res.status(401).json({ message: 'You are not logged in' })
    }

    req.userId = auth.userId

    return next()
}

export const shouldBeAdmin = (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req)
    const userId = auth.userId

    if (!userId) {
        return res.status(401).json({ message: 'You are not logged in' })
    }

    const role = (auth.sessionClaims?.metadata as { role?: string })?.role

    if (role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized' })
    }

    req.userId = userId

    return next()
}