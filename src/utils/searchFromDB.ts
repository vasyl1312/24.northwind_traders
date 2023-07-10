import { Client } from 'pg'

async function searchFromDB(client: Client, searchValue: string, table: string) {
  const selectedRows = getRows(table)
  let selectQuery = `SELECT ${selectedRows} FROM ${table}`

  if (searchValue) {
    const columnName = getColumnForTable(table)
    selectQuery += ` WHERE "${columnName}" LIKE '%${searchValue}%'`
  }

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
    table,
    searchValue,
    data: selectedData,
  }

  return result
}

function getColumnForTable(table: string): string {
  if (table === 'products') {
    return 'ProductName'
  } else if (table === 'customers') {
    return 'CompanyName'
  } else {
    throw new Error(`Invalid table name: ${table}`)
  }
}

function getRows(table: string): string {
  if (table === 'products') {
    return '"QuantityPerUnit", "UnitPrice", "UnitsInStock", "ProductName", "id", "ProductID"'
  } else if (table === 'customers') {
    return '"CompanyName", "ContactName", "ContactTitle", "Phone", "id", "CustomerID"'
  } else {
    throw new Error(`Invalid table name: ${table}`)
  }
}

export { searchFromDB }
