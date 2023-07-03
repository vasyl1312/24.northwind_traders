import express from 'express'
import dotenv from 'dotenv'
import { Client } from 'pg'
import { createTableAndInsertData, readSuppliersFromFile } from '../db/suppliersConnect'
import { selectSingleSupplier } from '../utils/querySuppliersUtils'

dotenv.config()

const router = express.Router()
const connectionString = process.env.DATABASE_URL
const client = new Client({ connectionString })

const suppliersRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const suppliersInfo = await readSuppliersFromFile()
      const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20

      const result = await createTableAndInsertData(client, suppliersInfo, res, page, limit)
      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  router.get('/:id', async (req, res) => {
    const supplierId = req.params.id
    try {
      const result = await selectSingleSupplier(client, supplierId)

      res.json(result)
    } catch (error) {
      console.error('Error retrieving data from the database:', error)
      res.status(500).send('Internal Server Error')
    }
  })
  return router
}
export default suppliersRoutes
