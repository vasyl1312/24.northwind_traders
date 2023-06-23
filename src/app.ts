import cors from 'cors'
import express from 'express'
import productsRoutes from './routes/productsRoutes'
import { swaggerRouter } from './swagger/router'

import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8081
const swaggerPort = process.env.SWAGGER_PORT || 4000

const app = express()

app.use(cors())
app.use(express.json())

app.use('/products', productsRoutes)
app.use('/api_docs', swaggerRouter)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})

app.listen(swaggerPort, () => {
  console.log(`Swagger listening on port  ${swaggerPort}`)
})
