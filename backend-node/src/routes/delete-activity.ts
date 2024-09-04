import { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { ZodTypeProvider } from "fastify-type-provider-zod";

export async function deleteActivity(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().delete(
    '/activities/:activityId',
    {
      schema: {
        params: z.object({
          activityId: z.string().uuid()
        })
      }
    },
    async (request) => {
      const { activityId } = request.params

      const activity = await prisma.activity.findUnique({
        where: {
          id: activityId
        }
      })

      if (!activity) {
        throw new ClientError('Activity not found!')
      }

      await prisma.activity.delete({
        where: {
          id: activityId
        }
      })

      return { activityId }
    }
  )
}