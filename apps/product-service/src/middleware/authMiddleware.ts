import { clerkClient, getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

type RoleMetadata = {
    role?: string;
};

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

export const shouldBeAdmin = async (req: Request, res: Response, next: NextFunction) => {
    const auth = getAuth(req)
    const userId = auth.userId

    if (!userId) {
        return res.status(401).json({ message: 'You are not logged in' })
    }

    const tokenRole = (auth.sessionClaims?.metadata as RoleMetadata | undefined)?.role
    const user = await clerkClient.users.getUser(userId)
    const publicRole = (user.publicMetadata as RoleMetadata | undefined)?.role
    const privateRole = (user.privateMetadata as RoleMetadata | undefined)?.role
    const unsafeRole = (user.unsafeMetadata as RoleMetadata | undefined)?.role
    const role = tokenRole ?? publicRole ?? privateRole ?? unsafeRole

    if (role !== 'admin') {
        return res.status(403).json({ message: 'You are not authorized' })
    }

    req.userId = userId

    return next()
}