import express from 'express'
import fs from 'fs'
import csv from 'csv-parser'
import createTableAndInsertData from '../db/productConnect' // Замініть шлях до файлу dbSetup.ts

const router = express.Router()

router.get('/', (req, res) => {
  const results: any[] = []

  fs.createReadStream('Telegram Archive/Products.csv')
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('end', async () => {
      try {
        const result = await createTableAndInsertData(results, res)
        res.json(result)
      } catch (error) {
        console.error('Error:', error)
        res.status(500).send('Internal Server Error')
      }
    })
})

export default router
