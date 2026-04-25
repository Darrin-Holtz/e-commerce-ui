import { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";

declare module "fastify" {
    interface FastifyRequest {
        userId?: string;
    }
}
export const shouldBeUser = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
    const { userId } = getAuth(request);
    if (!userId) {
        reply.send({ message: "You are not logged in" });
        return;
    }

    request.userId = userId;
};