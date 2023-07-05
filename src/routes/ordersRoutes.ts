import express from 'express'
import { readOrdersFromFile, readOrdersDetailsFromFile } from '../db/ordersReadAndFix'
import { createTableAndInsertData } from '../db/ordersConnect'
// import { selectSingleOrder } from '../utils/queryOrdersUtils'

const router = express.Router()

const ordersRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const ordersInfo = await readOrdersFromFile()
      const ordersDetailsInfo = await readOrdersDetailsFromFile()
      const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20

      const result = await createTableAndInsertData(
        client,
        ordersInfo,
        ordersDetailsInfo,
        res,
        page,
        limit
      )
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
