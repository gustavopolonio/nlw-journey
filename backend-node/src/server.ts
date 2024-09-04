import fastify from 'fastify'
import { serializerCompiler, validatorCompiler } from "fastify-type-provider-zod"
import cors from '@fastify/cors'
import { createTrip } from './routes/create-trip'
import { confirmTrip } from './routes/confirm-trip'
import { confirmParticipant } from './routes/confirm-participant'
import { createActivity } from './routes/create-activity'
import { getActivities } from './routes/get-activities'
import { createLink } from './routes/create-link'
import { getLinks } from './routes/get-links'
import { getParticipants } from './routes/get-participants'
import { createInvite } from './routes/create-invite'
import { updateTrip } from './routes/update-trip'
import { getTrip } from './routes/get-trip'
import { getParticipant } from './routes/get-participant'
import { errorHandler } from './error-handling'
import { env } from './env'
import { deleteParticipant } from './routes/delete-participant'
import { deleteLink } from './routes/delete-link'
import { deleteActivity } from './routes/delete-activity'

const app = fastify()
app.register(cors, {
  origin: true
})

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.setErrorHandler(errorHandler)

app.register(createTrip)
app.register(confirmTrip)
app.register(confirmParticipant)
app.register(createActivity)
app.register(getActivities)
app.register(createLink)
app.register(getLinks)
app.register(getParticipants)
app.register(createInvite)
app.register(updateTrip)
app.register(getTrip)
app.register(getParticipant)
app.register(deleteParticipant)
app.register(deleteLink)
app.register(deleteActivity)

app.listen({ port: env.PORT }).then(() => {
  console.log('App running!')
})

