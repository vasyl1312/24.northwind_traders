// import express from 'express'
// import dotenv from 'dotenv'
// import { Client } from 'pg'
// import { createTableAndInsertData, readProductsFromFile } from '../db/productConnect'
// import { selectSingleProduct } from '../utils/queryProductsUtils'

// dotenv.config()

// const router = express.Router()
// const connectionString = process.env.DATABASE_URL
// const client = new Client({ connectionString })

// router.get('/', async (req, res) => {
//   try {
//     await client.connect()

//     const productsInfo = await readProductsFromFile()
//     const result = await createTableAndInsertData(productsInfo, res)

//     res.json(result)
//   } catch (error) {
//     console.error('Error:', error)
//     res.status(500).send('Internal Server Error')
//   } finally {
//     await client.end()
//   }
// })

// router.get('/:id', async (req, res) => {
//   const productId = req.params.id
//   try {
//     await client.connect()
//     const result = await selectSingleProduct(client, productId)

//     res.json(result)
//   } catch (error) {
//     console.error('Error retrieving data from the database:', error)
//     res.status(500).send('Internal Server Error')
//   } finally {
//     await client.end()
//   }
// })

// export default router
import express from 'express'
import { createTableAndInsertData, readProductsFromFile } from '../db/productConnect'
import { selectSingleProduct } from '../utils/queryProductsUtils'

const router = express.Router()

const productsRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      await client.connect()

      const productsInfo = await readProductsFromFile()
      const result = await createTableAndInsertData(productsInfo, res)

      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    } finally {
      await client.end()
    }
  })

  router.get('/:id', async (req, res) => {
    const productId = req.params.id
    try {
      await client.connect()
      const result = await selectSingleProduct(client, productId)

      res.json(result)
    } catch (error) {
      console.error('Error retrieving data from the database:', error)
      res.status(500).send('Internal Server Error')
    } finally {
      await client.end()
    }
  })

  return router
}

export default productsRoutes
