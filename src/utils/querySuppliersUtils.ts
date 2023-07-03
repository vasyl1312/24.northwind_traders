import { Client } from 'pg'

async function selectSuppliers(client: Client, page: number, limit: number) {
  const offset = (page - 1) * limit // Обчислення зміщення для вибірки
  const selectQuery = `SELECT "id", "SupplierID", "CompanyName", "ContactName", "ContactTitle", "City", "Country" FROM suppliers
      OFFSET ${offset}
      LIMIT ${limit};
    `

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
    suppliers: selectedData,
  }

  return result
}

async function selectSingleSupplier(client: Client, productId: string) {
  const selectQuery = `SELECT "id", "SupplierID", "CompanyName", "ContactName", "ContactTitle", "Address", "City", "Region", "PostalCode", "Country", "Phone" FROM suppliers WHERE "id" = $1;`

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
    supplier: selectedData,
  }

  return result
}

export { selectSuppliers, selectSingleSupplier }
