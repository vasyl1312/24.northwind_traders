import csv from 'csv-parser'
import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { createReadStream } from 'fs'
import { getRegion } from '../utils/getRegion'

dotenv.config()

function readOrders1FromFile(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []
    createReadStream('Telegram Archive/Orders1.csv')
      .pipe(csv())
      .on('data', (data) => {
        const region = getRegion(data.ShipCountry)
        data.ShipRegion = region

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

async function createTableAndInsertOrders1(client: Client, ordersInfo: any[]) {
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS orders ("id" SERIAL PRIMARY KEY, "OrderID" integer, "CustomerID" varchar(255), "EmployeeID" integer, "OrderDate" date, "RequiredDate" date, "ShippedDate" date, "ShipVia" integer, "Freight" float, "ShipName" varchar(255), "ShipAddress" varchar(255), "ShipCity" varchar(255), "ShipRegion" varchar(255), "ShipPostalCode" varchar(255), "ShipCountry" varchar(255) );`

    await client.query(createTableQuery)
    const insertQuery = `INSERT INTO orders ("OrderID", "CustomerID", "EmployeeID", "OrderDate", "RequiredDate", "ShippedDate", "ShipVia", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry")
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`

    for (const row of ordersInfo) {
      const {
        OrderID,
        CustomerID,
        EmployeeID,
        OrderDate,
        RequiredDate,
        ShippedDate,
        ShipVia,
        Freight,
        ShipName,
        ShipAddress,
        ShipCity,
        ShipRegion,
        ShipPostalCode,
        ShipCountry,
      } = row

      // Check if a record with the same OrderID already exists
      const existingQuery = `
    SELECT
      "OrderID",
      "CustomerID",
      "EmployeeID",
      "OrderDate",
      "RequiredDate",
      "ShippedDate",
      "ShipVia",
      "Freight",
      "ShipName",
      "ShipAddress",
      "ShipCity",
      "ShipRegion",
      "ShipPostalCode",
      "ShipCountry"
    FROM orders
    WHERE
      "OrderID" = $1
    LIMIT 1;
  `
      const existingResult = await client.query(existingQuery, [OrderID])

      if (existingResult.rowCount === 0) {
        // If record does not exist, execute the INSERT query
        await client.query(insertQuery, [
          OrderID,
          CustomerID,
          EmployeeID,
          OrderDate,
          RequiredDate,
          ShippedDate,
          ShipVia,
          Freight,
          ShipName,
          ShipAddress,
          ShipCity,
          ShipRegion,
          ShipPostalCode,
          ShipCountry,
        ])
      }
    }
  } catch (error) {
    console.error('Error creating table and inserting ordersInfo:', error)
    throw new Error('Error creating table and inserting ordersInfo')
  }
}

export { readOrders1FromFile, createTableAndInsertOrders1 }
