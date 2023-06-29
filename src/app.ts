import cors from 'cors'
import express from 'express'
import { Client } from 'pg'
import { swaggerRouter } from './swagger/router'
import productsRoutes from './routes/productsRoutes'
import suppliersRoutes from './routes/suppliersRoutes'
import customersRoutes from './routes/customersRoutes'
import employeesRoutes from './routes/employeesRoutes'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8081
const connectionString = process.env.DATABASE_URL
const client = new Client({ connectionString })

const app = express()

app.use(cors())
app.use(express.json())

app.use('/products', productsRoutes(client))
app.use('/suppliers', suppliersRoutes(client))
app.use('/customers', customersRoutes(client))
app.use('/employees', employeesRoutes(client))

app.use('/api_docs', swaggerRouter)

client
  .connect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('Error connecting to the database:', error)
  })
