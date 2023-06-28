import express from 'express'
import { createTableAndInsertData, readProductsFromFile } from '../db/productConnect'
import { selectSingleProduct } from '../utils/queryProductsUtils'

const router = express.Router()

const productsRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const productsInfo = await readProductsFromFile()
      const result = await createTableAndInsertData(client, productsInfo, res)

      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  router.get('/:id', async (req, res) => {
    const productId = req.params.id
    try {
      const result = await selectSingleProduct(client, productId)

      res.json(result)
    } catch (error) {
      console.error('Error retrieving data from the database:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  return router
}

export default productsRoutes
