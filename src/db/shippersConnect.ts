import csv from 'csv-parser'
import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { createReadStream } from 'fs'
dotenv.config()

function readShippersFromFile(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []

    createReadStream('Telegram Archive/Shippers.csv')
      .pipe(csv())
      .on('data', (data) => {
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

async function createTableAndInsertShippers(client: Client, shippersInfo: any[]) {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS shippers (
        "id" SERIAL PRIMARY KEY,
        "ShipperID" integer,
        "CompanyName" varchar(255),
        "Phone" varchar(255)
      );
    `
    await client.query(createTableQuery)

    const insertQuery = `INSERT INTO shippers ("ShipperID","CompanyName","Phone")
      VALUES ($1, $2, $3);`

    for (const row of shippersInfo) {
      const { ShipperID, CompanyName, Phone } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `
        SELECT
          "id",
          "ShipperID",
          "CompanyName",
          "Phone"
        FROM shippers
        WHERE
          "ShipperID" = $1 AND
          "CompanyName" = $2 AND
          "Phone" = $3 
        LIMIT 1;
      `
      const existingResult = await client.query(existingQuery, [ShipperID, CompanyName, Phone])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено, виконуємо INSERT запит
        await client.query(insertQuery, [ShipperID, CompanyName, Phone])
      }
    }
  } catch (error) {
    console.error('Error creating table and inserting shippersInfo:', error)
    throw new Error('Error creating table and inserting shippersInfo')
  }
}

export { readShippersFromFile, createTableAndInsertShippers }
