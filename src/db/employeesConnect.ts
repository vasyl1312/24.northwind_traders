import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { Response } from 'express'
import { selectEmployees } from '../utils/queryEmployeesUtils'
dotenv.config()

async function createTableAndInsertData(client: Client, employeesInfo: any[], res: Response) {
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS employees (
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

    const insertQuery = `INSERT INTO employees ("CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`

    for (const row of employeesInfo) {
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
      const existingQuery = `SELECT "id", "CustomerID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone", "Fax" FROM employees
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
    const result = await selectEmployees(client)
    return result
  } catch (error) {
    console.error('Error creating table and inserting employeesInfo:', error)
    throw new Error('Error creating table and inserting employeesInfo')
  }
}

export { createTableAndInsertData }
