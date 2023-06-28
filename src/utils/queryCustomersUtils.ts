import { Client } from 'pg'

async function selectCustomers(client: Client) {
  // Вибірка лише вибраних даних з таблиці
  const selectQuery = `SELECT "id", "CustomerID", "CompanyName", "ContactName", "ContactTitle", "City", "Country" FROM customers;`
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
    customers: selectedData,
  }

  return result
}

async function selectSingleCustomer(client: Client, productId: string) {
  const selectQuery = `SELECT * FROM customers WHERE "id" = $1;`

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
    customer: selectedData,
  }

  return result
}

export { selectCustomers, selectSingleCustomer }
