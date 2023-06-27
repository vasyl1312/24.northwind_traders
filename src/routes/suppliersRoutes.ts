import express from 'express'
import dotenv from 'dotenv'
import { Client } from 'pg'
import { createTableAndInsertData, readSuppliersFromFile } from '../db/suppliersConnect'
import { selectSingleSupplier } from '../utils/querySuppliersUtils'

dotenv.config()

const router = express.Router()
const connectionString = process.env.DATABASE_URL
const client = new Client({ connectionString })

router.get('/', async (req, res) => {
  try {
    const suppliersInfo = await readSuppliersFromFile()
    const result = await createTableAndInsertData(suppliersInfo, res)

    res.json(result)
  } catch (error) {
    console.error('Error:', error)
    res.status(500).send('Internal Server Error')
  }
})

router.get('/:id', async (req, res) => {
  const supplierId = req.params.id
  try {
    // await client.connect()
    const result = await selectSingleSupplier(client, supplierId)

    res.json(result)
  } catch (error) {
    console.error('Error retrieving data from the database:', error)
    res.status(500).send('Internal Server Error')
  } finally {
    // await client.end()
  }
})

export default router
