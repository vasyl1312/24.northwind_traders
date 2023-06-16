import csv from 'csv-parser'
import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { Response } from 'express'
import { selectProducts } from '../utils/queryUtils'
import { createReadStream } from 'fs'
dotenv.config()

const connectionString = process.env.DATABASE_URL
const client = new Client({ connectionString })

function readProductsFromFile(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []

    createReadStream('Telegram Archive/Products.csv')
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

async function createTableAndInsertData(productsInfo: any[], res: Response) {
  try {
    await client.connect()
    console.log('Connected to the database')

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS products1 (
        "id" SERIAL PRIMARY KEY,
        "ProductID" integer,
        "ProductName" varchar(255),
        "SupplierID" integer,
        "CategoryID" integer,
        "QuantityPerUnit" varchar(255),
        "UnitPrice" numeric,
        "UnitsInStock" integer,
        "UnitsOnOrder" integer,
        "ReorderLevel" integer,
        "Discontinued" integer
      );
    `
    await client.query(createTableQuery)

    const insertQuery = `
      INSERT INTO products1 (
        "ProductID",
        "ProductName",
        "SupplierID",
        "CategoryID",
        "QuantityPerUnit",
        "UnitPrice",
        "UnitsInStock",
        "UnitsOnOrder",
        "ReorderLevel",
        "Discontinued"
      )
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
      );
    `

    for (const row of productsInfo) {
      const {
        ProductID,
        ProductName,
        SupplierID,
        CategoryID,
        QuantityPerUnit,
        UnitPrice,
        UnitsInStock,
        UnitsOnOrder,
        ReorderLevel,
        Discontinued,
      } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `
        SELECT
          "id",
          "ProductID",
          "ProductName",
          "QuantityPerUnit",
          "UnitPrice",
          "UnitsInStock",
          "UnitsOnOrder"
        FROM products1
        WHERE
          "ProductID" = $1 AND
          "ProductName" = $2 AND
          "SupplierID" = $3 AND
          "CategoryID" = $4 AND
          "QuantityPerUnit" = $5 AND
          "UnitPrice" = $6 AND
          "UnitsInStock" = $7 AND
          "UnitsOnOrder" = $8 AND
          "ReorderLevel" = $9 AND
          "Discontinued" = $10
        LIMIT 1;
      `
      const existingResult = await client.query(existingQuery, [
        ProductID,
        ProductName,
        SupplierID,
        CategoryID,
        QuantityPerUnit,
        UnitPrice,
        UnitsInStock,
        UnitsOnOrder,
        ReorderLevel,
        Discontinued,
      ])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено, виконуємо INSERT запит
        await client.query(insertQuery, [
          ProductID,
          ProductName,
          SupplierID,
          CategoryID,
          QuantityPerUnit,
          UnitPrice,
          UnitsInStock,
          UnitsOnOrder,
          ReorderLevel,
          Discontinued,
        ])
      }
    }

    //query
    const result = await selectProducts(client)
    return result
  } catch (error) {
    console.error('Error creating table and inserting productsInfo:', error)
    throw new Error('Error creating table and inserting productsInfo')
  } finally {
    await client.end()
    console.log('Disconnected from the database')
  }
}

export { readProductsFromFile, createTableAndInsertData }
