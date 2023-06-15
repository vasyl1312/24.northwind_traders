import cors from 'cors'
import express from 'express'
import productsRoutes from './routes/productsRoutes'
import * as dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT || 8081
const app = express()

app.use(cors())
app.use(express.json())

app.use('/products', productsRoutes)

app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`)
})
