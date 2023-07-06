import * as dotenv from 'dotenv'
import { Client } from 'pg'
dotenv.config()

async function createTableAndInsertDetails(client: Client, ordersDetailsInfo: any[]) {
  try {
    const createTableQueryOrdersDetails = `CREATE TABLE IF NOT EXISTS ordersdetails (
        "id" SERIAL PRIMARY KEY,
        "OrderID" integer,
        "ProductID" integer,
        "UnitPrice" varchar(255),
        "Quantity" integer,
        "Discount" varchar(255)
        );`

    await client.query(createTableQueryOrdersDetails)

    const insertQueryOrdersDetails = `INSERT INTO ordersdetails ("OrderID", "ProductID", "UnitPrice", "Quantity", "Discount")
      VALUES ($1, $2, $3, $4, $5);`
    for (const row of ordersDetailsInfo) {
      const { OrderID, ProductID, UnitPrice, Quantity, Discount } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQueryDetails = `SELECT "id", "OrderID", "ProductID", "UnitPrice", "Quantity", "Discount" FROM ordersdetails
        WHERE
          "OrderID"= $1 AND
          "ProductID"= $2 AND
          "UnitPrice"= $3 AND
          "Quantity"= $4 AND
          "Discount"= $5
        LIMIT 1;
      `

      const existingResultDetails = await client.query(existingQueryDetails, [
        OrderID,
        ProductID,
        UnitPrice,
        Quantity,
        Discount,
      ])

      if (existingResultDetails.rowCount === 0) {
        // Якщо запис не знайдено і ще не було виконано вставки
        await client.query(insertQueryOrdersDetails, [
          OrderID,
          ProductID,
          UnitPrice,
          Quantity,
          Discount,
        ])
      }
    }
  } catch (error) {
    console.error('Error creating table and inserting ordersInfo:', error)
    throw new Error('Error creating table and inserting ordersInfo')
  }
}

export { createTableAndInsertDetails }
