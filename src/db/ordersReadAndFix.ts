import * as dotenv from 'dotenv'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
import { getRegion } from '../utils/getRegion'
dotenv.config()

async function readOrdersDetailsFromFile(): Promise<any[]> {
  const results: any[] = []

  return new Promise((resolve, reject) => {
    createReadStream('Telegram Archive/OrderDetails.csv')
      .pipe(csv())
      .on('data', async (data) => {
        results.push(data)
      })
      .on('end', () => {
        resolve(results)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}
export { readOrdersDetailsFromFile }
