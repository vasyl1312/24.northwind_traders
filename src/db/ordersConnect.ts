import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { Response } from 'express'
import { selectOrders } from '../utils/queryOrdersUtils'
dotenv.config()

async function createTableAndInsertData(
  client: Client,
  ordersInfo: any[],
  ordersDetailsInfo: any[],
  res: Response,
  page: number,
  limit: number
) {
  try {
    const createTableQueryOrders = `CREATE TABLE IF NOT EXISTS orders (
      "id" SERIAL PRIMARY KEY,
      "OrderID" integer,
      "CustomerID" varchar(255),
      "OrderDate" varchar(255),
      "RequiredDate" varchar(255),
      "ShippedDate" varchar(255),
      "Freight" varchar(255),
      "ShipName" varchar(255),
      "ShipAddress" varchar(255),
      "ShipCity" varchar(255),
      "ShipRegion" varchar(255),
      "ShipPostalCode" varchar(255),
      "ShipCountry" varchar(255)
      );`

    const createTableQueryOrdersDetails = `CREATE TABLE IF NOT EXISTS ordersdetails (
        "id" SERIAL PRIMARY KEY,
        "OrderID" integer,
        "ProductID" integer,
        "UnitPrice" varchar(255),
        "Quantity" integer,
        "Discount" varchar(255)
        );`

    await client.query(createTableQueryOrders)
    await client.query(createTableQueryOrdersDetails)

    const insertQuery = `INSERT INTO orders ("OrderID", "CustomerID", "OrderDate", "RequiredDate", "ShippedDate", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry" )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`
    const insertQueryOrdersDetails = `INSERT INTO ordersdetails ("OrderID", "ProductID", "UnitPrice", "Quantity", "Discount")
      VALUES ($1, $2, $3, $4, $5);`

    for (const row of ordersInfo) {
      const {
        OrderID,
        CustomerID,
        OrderDate,
        RequiredDate,
        ShippedDate,
        Freight,
        ShipName,
        ShipAddress,
        ShipCity,
        ShipRegion,
        ShipPostalCode,
        ShipCountry,
      } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `SELECT "id", "OrderID", "CustomerID", "OrderDate", "RequiredDate", "ShippedDate", "Freight", "ShipName", "ShipAddress", "ShipCity", "ShipRegion", "ShipPostalCode", "ShipCountry" FROM orders
        WHERE
          "OrderID"= $1 AND 
          "CustomerID"= $2 AND 
          "OrderDate"= $3 AND 
          "RequiredDate"= $4 AND 
          "ShippedDate"= $5 AND 
          "Freight"= $6 AND 
          "ShipName"= $7 AND 
          "ShipAddress"= $8 AND 
          "ShipCity"= $9 AND 
          "ShipRegion"= $10 AND 
          "ShipPostalCode"= $11 AND 
          "ShipCountry"= $12  
        LIMIT 1;
      `

      const existingResult = await client.query(existingQuery, [
        OrderID,
        CustomerID,
        OrderDate,
        RequiredDate,
        ShippedDate,
        Freight,
        ShipName,
        ShipAddress,
        ShipCity,
        ShipRegion,
        ShipPostalCode,
        ShipCountry,
      ])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено і ще не було виконано вставки
        await client.query(insertQuery, [
          OrderID,
          CustomerID,
          OrderDate,
          RequiredDate,
          ShippedDate,
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
    // Додатковий код, якщо необхідно виконати запит до доданих даних
    // const result = await selectOrders(client, page, limit)
    // return result
  } catch (error) {
    console.error('Error creating table and inserting ordersInfo:', error)
    throw new Error('Error creating table and inserting ordersInfo')
  }
}

export { createTableAndInsertData }
