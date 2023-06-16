import { Client } from 'pg'

async function selectProducts(client: Client) {
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
}

async function selectSingleProduct(client: Client, productId: string) {
  const selectQuery = `SELECT "id", "ProductID", "ProductName", "QuantityPerUnit", "UnitPrice", "UnitsInStock", "SupplierID", "ReorderLevel", "Discontinued", "UnitsOnOrder" FROM products1 WHERE "id" = $1;` //AND Supplier.Id=Product.SupplierId додати???????????????????????????????????????

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
    products: selectedData,
  }

  return result
}

export { selectProducts, selectSingleProduct }
