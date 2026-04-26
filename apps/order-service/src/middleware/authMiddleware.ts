import { getAuth } from "@clerk/fastify";
import { FastifyReply, FastifyRequest } from "fastify";
import type { CustomJwtSessionClaims } from "@e-commerce-ui/types";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}
export const shouldBeUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
        reply.status(401).send({ message: "You are not logged in" });
        return;
    }

    request.userId = userId;
};

export const shouldBeAdmin = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const auth = getAuth(request);
    if (!auth.userId) {
        reply.status(401).send({ message: "You are not logged in" });
        return;
    }

    const claims = auth.sessionClaims as CustomJwtSessionClaims;

    if (claims.metadata?.role !== "admin") {
        return reply.status(403).send({ message: "You are not authorized" });
    }

    request.userId = auth.userId;
};