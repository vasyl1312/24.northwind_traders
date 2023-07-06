import express from 'express'
import { selectCustomers, selectSingleCustomer } from '../utils/queryCustomersUtils'
import { createAndRead } from '../db/readAndCreateTables'

const router = express.Router()

const customersRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      // createAndRead(client)
      const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20

      const result = await selectCustomers(client, page, limit)
      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  router.get('/:id', async (req, res) => {
    const customerId = req.params.id
    try {
      const result = await selectSingleCustomer(client, customerId)
      res.json(result)
    } catch (error) {
      console.error('Error retrieving data from the database:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  return router
}

export default customersRoutes
