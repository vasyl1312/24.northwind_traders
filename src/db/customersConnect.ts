import * as dotenv from 'dotenv'
import csv from 'csv-parser'
import { Client } from 'pg'
import { Response } from 'express'
import { createReadStream } from 'fs'
import { getRegion } from '../utils/getRegion'
import { selectCustomers } from '../utils/queryCustomersUtils'

dotenv.config()

async function readCustomersFromFile(): Promise<any[]> {
  const results: any[] = []

  return new Promise((resolve, reject) => {
    createReadStream('Telegram Archive/Customers.csv')
      .pipe(csv())
      .on('data', async (data) => {
        if (data.CompanyName !== 'IT') {
          const region = getRegion(data.Country)
          data.Region = region

          if (!data.Fax) {
            data.Fax = null
          }

          results.push(data)
        }
      })
      .on('end', () => {
        resolve(results)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

async function createTableAndInsertData(client: Client, customersInfo: any[], res: Response) {
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS customers ( 
      "id" SERIAL PRIMARY KEY, 
      "CustomerID" varchar(255), 
      "CompanyName" varchar(255), 
      "ContactName" varchar(255), 
      "ContactTitle" varchar(255), 
      "Address" varchar(255), 
      "City" varchar(255), 
      "Region" varchar(255), 
      "PostalCode" varchar(255), 
      "Country" varchar(255), 
      "Phone" varchar(255), 
      "Fax" varchar(255) );`

    await client.query(createTableQuery)

    const insertQuery = `INSERT INTO customers ("CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`

    for (const row of customersInfo) {
      const {
        CustomerID,
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
      } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `SELECT "id", "CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax" FROM customers
        WHERE
          "CustomerID" = $1 AND 
          "CompanyName" = $2 AND
          "ContactName" = $3 AND
          "ContactTitle" = $4 AND
          "Address" = $5 AND
          "City" = $6 AND
          "Region" = $7 AND
          "PostalCode" = $8 AND
          "Country" = $9 AND
          "Phone" = $10 AND
          "Fax" = $11
        LIMIT 1;
      `
      const existingResult = await client.query(existingQuery, [
        CustomerID,
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
      ])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено, виконуємо INSERT запит
        await client.query(insertQuery, [
          CustomerID,
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
        ])
      }
    }

    // Додатковий код, якщо необхідно виконати запит до доданих даних
    const result = await selectCustomers(client)
    return result
  } catch (error) {
    console.error('Error creating table and inserting CustomersInfo:', error)
    throw new Error('Error creating table and inserting CustomersInfo')
  }
}

export { readCustomersFromFile, createTableAndInsertData }
