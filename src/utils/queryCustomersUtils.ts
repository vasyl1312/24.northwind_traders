import { Client } from 'pg'

async function selectCustomers(client: Client, page: number, limit: number) {
  const offset = (page - 1) * limit // Обчислення зміщення для вибірки
  const selectQuery = `SELECT "id", "CustomerID", "CompanyName", "ContactName", "ContactTitle", "City", "Country" FROM customers OFFSET ${offset} LIMIT ${limit};`
  const countQuery = `SELECT COUNT(*) FROM customers;`

  const startTime = new Date()

  const selectResult = await client.query(selectQuery)
  const selectFinishTime = new Date()
  const selectExecutionTimeToSecond = (selectFinishTime.getTime() - startTime.getTime()) / 1000

  const countResult = await client.query(countQuery)
  const countFinishTime = new Date()
  const countExecutionTimeToSecond = (countFinishTime.getTime() - selectFinishTime.getTime()) / 1000

  const selectSqlLog = {
    querySqlLog: selectQuery,
    startTime: startTime.toISOString(),
    finishTime: selectFinishTime.toISOString(),
    executionTimeToSecond: selectExecutionTimeToSecond.toFixed(3),
  }

  const countSqlLog = {
    querySqlLog: countQuery,
    startTime: selectFinishTime.toISOString(),
    finishTime: countFinishTime.toISOString(),
    executionTimeToSecond: countExecutionTimeToSecond.toFixed(3),
  }

  const selectedData = selectResult.rows
  const totalElementsFromDB = +countResult.rows[0].count

  const maxPage = Math.ceil(totalElementsFromDB / limit)

  let result = {
    sqlLog: [selectSqlLog, countSqlLog],
    totalElementsFromDB,
    maxPage,
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
