import * as dotenv from 'dotenv'
import csv from 'csv-parser'
import { Client } from 'pg'
import { Response } from 'express'
import { createReadStream } from 'fs'
import { getRegion } from '../utils/getRegion'
import { selectSuppliers } from '../utils/querySuppliersUtils'

dotenv.config()

async function readSuppliersFromFile(): Promise<any[]> {
  const results: any[] = []

  return new Promise((resolve, reject) => {
    createReadStream('Telegram Archive/Supplies.csv')
      .pipe(csv())
      .on('data', async (data) => {
        const region = getRegion(data.Country)
        data.Region = region

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

async function createTableAndInsertData(
  client: Client,
  suppliersInfo: any[],
  res: Response,
  page: number,
  limit: number
) {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS suppliers (
        "id" SERIAL PRIMARY KEY,
        "SupplierID" integer,
        "CompanyName" varchar(255),
        "ContactName" varchar(255),
        "ContactTitle" varchar(255),
        "Address" varchar(255),
        "City" varchar(255),
        "Region" varchar(255),
        "PostalCode" varchar(255),
        "Country" varchar(255),
        "Phone" varchar(255),
        "Fax" varchar(255),
        "HomePage" varchar(255)
      );
    `
    await client.query(createTableQuery)

    const insertQuery = `INSERT INTO suppliers ("SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`

    for (const row of suppliersInfo) {
      const {
        SupplierID,
        CompanyName,
        ContactName,
        ContactTitle,
        Address,
        City,
        Region,
        PostalCode,
        Country,
        Phone,
        Fax,
        HomePage,
      } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `SELECT "id", "SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax", "HomePage" FROM suppliers
        WHERE
          "SupplierID" = $1 AND 
          "CompanyName" = $2 AND
          "ContactName" = $3 AND
          "ContactTitle" = $4 AND
          "Address" = $5 AND
          "City" = $6 AND
          "Region" = $7 AND
          "PostalCode" = $8 AND
          "Country" = $9 AND
          "Phone" = $10 AND
          "Fax" = $11 AND
          "HomePage" = $12
        LIMIT 1;
      `
      const existingResult = await client.query(existingQuery, [
        SupplierID,
        CompanyName,
        ContactName,
        ContactTitle,
        Address,
        City,
        Region,
        PostalCode,
        Country,
        Phone,
        Fax,
        HomePage,
      ])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено, виконуємо INSERT запит
        await client.query(insertQuery, [
          SupplierID,
          CompanyName,
          ContactName,
          ContactTitle,
          Address,
          City,
          Region,
          PostalCode,
          Country,
          Phone,
          Fax,
          HomePage,
        ])
      }
    }

    // Додатковий код, якщо необхідно виконати запит до доданих даних
    const result = await selectSuppliers(client, page, limit)
    return result
  } catch (error) {
    console.error('Error creating table and inserting suppliersInfo:', error)
    throw new Error('Error creating table and inserting suppliersInfo')
  }
}

export { readSuppliersFromFile, createTableAndInsertData }
