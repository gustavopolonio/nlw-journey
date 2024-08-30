import { prisma } from '../lib/prisma';
import { getMailClient } from '../lib/mail';
import { dayjs } from '../lib/dayjs';
import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';
import nodemailer from 'nodemailer'
import { ClientError } from '../errors/client-error';
import { env } from 'process';

export async function createTrip(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/trips',
    {
      schema: {
        body: z.object({
          destination: z.string().min(3),
          starts_at: z.coerce.date(),
          ends_at: z.coerce.date(),
          owner_name: z.string(),
          owner_email: z.string().email(),
          emails_to_invite: z.array(z.string().email())
        })
      }
    },
    async (request) => {
      const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body

      if (dayjs(starts_at).isBefore(dayjs(new Date().setHours(0, 0, 0, 0)))) {
        throw new ClientError('Invalid trip start date.')
      }

      if (dayjs(ends_at).isBefore(dayjs(starts_at))) {
        throw new ClientError('Invalid trip end date.')
      }

      const trip = await prisma.trip.create({
        data: {
          destination,
          starts_at,
          ends_at,
          participants: {
            createMany: ({
              data: [
                {
                  name: owner_name,
                  email: owner_email,
                  is_owner: true,
                  is_confirmed: true
                },
                ...emails_to_invite.map(email => {
                  return { email }
                })
              ]
            })
          }
        }
      })

      const formattedStartDate = dayjs(starts_at).format('LL')
      const formattedEndDate = dayjs(ends_at).format('LL')

      const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirm`

      const mail = await getMailClient()

      const info = await mail.sendMail({
        from: 'Equipe plann.er <oi@plann.er>',
        to: `${owner_name} <${owner_email}>`,
        subject: `Confirme sua viagem para ${destination} em ${formattedStartDate}`,
        html: `
          <div style="font-family: sans-serif; font-size: 16px; line-height: 1.6;">
            <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formattedStartDate}</strong> até <strong>${formattedEndDate}</strong>.</p>
            <p></p>
            <p>Para confirmar sua viagem, clique no link abaixo:</p>
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

      return {
        tripId: trip.id
      }
    }
  )
}