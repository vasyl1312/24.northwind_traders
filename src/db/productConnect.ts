import { Client } from 'pg'
import { Response } from 'express'
import * as dotenv from 'dotenv'
dotenv.config()

const connectionString = process.env.DATABASE_URL
async function createTableAndInsertData(productsInfo: any[], res: Response) {
  const client = new Client({ connectionString })

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

    // Вибірка лише вибраних даних з таблиці
    const selectQuery = `SELECT "id", "ProductID", "ProductName", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "UnitsOnOrder" FROM products1;`
    const startTime = new Date()
    const selectResult = await client.query(selectQuery)
    const finishTime = new Date()
    const executionTimeToSecond = (finishTime.getTime() - startTime.getTime()) / 1000

    const sqlLog = [
      {
        querySqlLog: selectQuery,
        startTime: startTime.toISOString(),
        finishTime: finishTime.toISOString(),
        executionTimeToSecond: executionTimeToSecond.toFixed(3),
      },
    ]

    const selectedData = selectResult.rows
    let result = {
      sqlLog,
      products: selectedData,
    }

    return result
  } catch (error) {
    console.error('Error creating table and inserting productsInfo:', error)
    throw new Error('Error creating table and inserting productsInfo')
  } finally {
    await client.end()
    console.log('Disconnected from the database')
  }
}

export default createTableAndInsertData
