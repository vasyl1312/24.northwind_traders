import { Client } from 'pg'

async function selectEmployees(client: Client) {
  // Вибірка лише вибраних даних з таблиці
  const selectQuery = `SELECT "id", "EmployeeID", "Name", "Title", "City", "Country", "HomePhone" FROM employees;`
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
    employees: selectedData,
  }

  return result
}

async function selectSingleEmployee(client: Client, productId: string) {
  const selectQuery = `SELECT * FROM employees WHERE "id" = $1;`

  const startTime = new Date()
  const selectResult = await client.query(selectQuery, [productId])
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
    employee: selectedData,
  }

  return result
}

export { selectEmployees, selectSingleEmployee }
