import express from 'express'
import { selectOrders } from '../utils/queryOrdersUtils'
import { createAndRead } from '../db/readAndCreateTables'
import { Client } from 'pg'
import { readOrdersFromFile } from '../db/ordersReadAndFix'
// import { selectSingleOrder } from '../utils/queryOrdersUtils'

const router = express.Router()

const ordersRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      // createAndRead(client)
      const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20

      const result = await selectOrders(client, page, limit)
      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  // router.get('/:id', async (req, res) => {
  //   const employeeId = req.params.id
  //   try {
  //     const result = await selectSingleOrder(client, employeeId)

  //     res.json(result)
  //   } catch (error) {
  //     console.error('Error retrieving data from the database:', error)
  //     res.status(500).send('Internal Server Error')
  //   }
  // })

  return router
}

export default ordersRoutes
