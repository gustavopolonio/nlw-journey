import { dayjs } from '../lib/dayjs';
import { prisma } from '../lib/prisma';
import { getMailClient } from '../lib/mail';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import nodemailer from 'nodemailer'
import { ClientError } from '../errors/client-error';
import { env } from 'process';

export async function createInvite(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips/:tripId/invite',
    {
      schema: {
        params: z.object({
          tripId: z.string().uuid()
        }),
        body: z.object({
          emails_to_invite: z.array(z.string().email())
        })
      }
    },
    async (request) => {
      const { tripId } = request.params
      const { emails_to_invite } = request.body

      const trip = await prisma.trip.findUnique({
        where: {
          id: tripId
        },
        include: {
          participants: {
            select: {
              email: true
            }
          }
        }
      })

      if (!trip) {
        throw new ClientError('Trip not found!')
      }

      // Remove possible duplicate emails of emails_to_invite
      const emailsToInvite = [...new Set(emails_to_invite)]

      // Remove participants already invited
      const participantsAlreadyInvited = trip.participants.map(participant => participant.email)
      const emailsToInviteParsed = emailsToInvite.filter(email => {
        return !participantsAlreadyInvited.includes(email)
      })

      if (emailsToInviteParsed.length === 0) {
        throw new ClientError('There is no new participant to invite')
      }

      const participants = await prisma.participant.createManyAndReturn({
        data: emailsToInviteParsed.map(email => ({
          email,
          trip_id: tripId
        }))
      })

      const formattedStartDate = dayjs(trip.starts_at).format('LL')
      const formattedEndDate = dayjs(trip.ends_at).format('LL')

      const mail = await getMailClient()

      await Promise.all(
        participants.map(async (participant) => {
          const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`
    
          const info = await mail.sendMail({
            from: 'Equipe plann.er <oi@plann.er>',
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination} em ${formattedStartDate}`,
            html: `
              <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
                <p>Você foi convidado(a) para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
                <p></p>
                <p>Para confirmar sua presença na viagem, clique no link abaixo:</p>
                <p></p>
                <p>
                  <a href=${confirmationLink}>Confirmar viagem</a>
                </p>
                <p></p>
                <p>Caso você não saiba do que se trata esse e-mail, apenas ignore.</p>
              </div>
            `.trim()
          })
    
          console.log(nodemailer.getTestMessageUrl(info))
        })
      )

      return { participantsId: Array.from(participants, (participant) => participant.id) }
    }
  )
}