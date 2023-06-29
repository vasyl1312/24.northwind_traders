import * as dotenv from 'dotenv'
import { Client } from 'pg'
import { Response } from 'express'
import { selectEmployees } from '../utils/queryEmployeesUtils'
dotenv.config()

async function createTableAndInsertData(client: Client, employeesInfo: any[], res: Response) {
  try {
    const createTableQuery = `CREATE TABLE IF NOT EXISTS employees (
      "id" SERIAL PRIMARY KEY,
      "EmployeeID" integer,
      "Name" varchar(255),
      "Title" varchar(255),
      "TitleOfCourtesy" varchar(255),
      "Address" varchar(255),
      "City" varchar(255),
      "BirthDate" varchar(255),
      "PostalCode" varchar(255),
      "Country" varchar(255),
      "HireDate" varchar(255),
      "HomePhone" varchar(255),
      "Extension" integer,
      "Notes" text,
      "ReportsTo" integer 
      );`

    await client.query(createTableQuery)

    const insertQuery = `INSERT INTO employees ("EmployeeID", "Name", "Title", "TitleOfCourtesy", "Address", "City", "BirthDate", "PostalCode", "Country", "HireDate", "HomePhone", "Extension", "Notes", "ReportsTo" )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14);`

    for (const row of employeesInfo) {
      const {
        EmployeeID,
        Name,
        Title,
        TitleOfCourtesy,
        Address,
        City,
        BirthDate,
        PostalCode,
        Country,
        HireDate,
        HomePhone,
        Extension,
        Notes,
        ReportsTo,
      } = row

      // Перевірка, чи існує вже запис з такими даними
      const existingQuery = `SELECT "id", "EmployeeID", "Name", "Title", "TitleOfCourtesy", "Address", "City", "BirthDate", "PostalCode", "Country", "HireDate", "HomePhone", "Extension", "Notes", "ReportsTo" FROM employees
        WHERE
          "EmployeeID" = $1 AND
          "Name" = $2 AND
          "Title" = $3 AND
          "TitleOfCourtesy" = $4 AND
          "Address" = $5 AND
          "City" = $6 AND
          "BirthDate" = $7 AND
          "PostalCode" = $8 AND
          "Country" = $9 AND
          "HireDate" = $10 AND
          "HomePhone" = $11 AND
          "Extension" = $12 AND 
          "Notes" = $13 AND 
          "ReportsTo"= $14
        LIMIT 1;
      `
      const existingResult = await client.query(existingQuery, [
        EmployeeID,
        Name,
        Title,
        TitleOfCourtesy,
        Address,
        City,
        BirthDate,
        PostalCode,
        Country,
        HireDate,
        HomePhone,
        Extension,
        Notes,
        ReportsTo,
      ])

      if (existingResult.rowCount === 0) {
        // Якщо запис не знайдено, виконуємо INSERT запит
        await client.query(insertQuery, [
          EmployeeID,
          Name,
          Title,
          TitleOfCourtesy,
          Address,
          City,
          BirthDate,
          PostalCode,
          Country,
          HireDate,
          HomePhone,
          Extension,
          Notes,
          ReportsTo,
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
