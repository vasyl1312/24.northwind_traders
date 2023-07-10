import express from 'express'
import { searchFromDB } from '../utils/searchFromDB'

const router = express.Router()

type TableValue = 'customers' | 'products'

const searchRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const { searchValue, table } = req.query

      if (
        typeof table !== 'string' ||
        typeof searchValue !== 'string' ||
        !isValidTableValue(table)
      ) {
        throw new Error(
          `Invalid table value. Expected 'customers' or 'products', received '${table}'`
        )
      }

      const result = await searchFromDB(client, searchValue, table as TableValue)
      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  return router
}

function isValidTableValue(value: string): value is TableValue {
  return value === 'customers' || value === 'products'
}

export default searchRoutes
