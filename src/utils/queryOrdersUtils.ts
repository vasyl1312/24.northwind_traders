import { Client } from 'pg'

async function selectOrders(client: Client, page: number, limit: number) {
  const offset = (page - 1) * limit // Обчислення зміщення для вибірки
  const selectQuery = `SELECT
    "orders"."id",
    "orders"."OrderID",
    CONCAT('$', ROUND(SUM("ordersdetails"."UnitPrice"::numeric * "ordersdetails"."Quantity"::numeric), 2)) AS "TotalProductsPrice",
    SUM("ordersdetails"."Quantity"::numeric) AS "TotalQuantity",
    COUNT("ordersdetails"."ProductID") AS "TotalProducts",
    "orders"."ShippedDate",
    "orders"."ShipName",
    "orders"."ShipCountry",
    "orders"."ShipCity"
  FROM
    "orders"
  LEFT JOIN
    "ordersdetails" ON "orders"."OrderID" = "ordersdetails"."OrderID"
  GROUP BY
    "ordersdetails"."OrderID",
    "orders"."OrderID",
    "orders"."id"
  ORDER BY
    "orders"."OrderID"
  OFFSET ${offset} LIMIT ${limit};
`
  const countQuery = `SELECT COUNT(*) FROM orders;`
  const startTime = new Date()

  const selectResult = await client.query(selectQuery)
  const selectFinishTime = new Date()
  const selectExecutionTimeToSecond = (selectFinishTime.getTime() - startTime.getTime()) / 1000

  for (let i = 0; i < selectResult.rows.length; i++) {
    const shippedDate = selectResult.rows[i].ShippedDate
    const formattedDate = new Date(shippedDate).toLocaleDateString('en-US')
    selectResult.rows[i].ShippedDate = formattedDate
  }

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
    orders: selectedData,
  }

  return result
}

async function selectSingleOrder(client: Client, orderId: string) {
  // const selectQuery = `SELECT * FROM orders WHERE "OrderID" = $1;`
  const selectQuery = `SELECT
    "orders"."id",
    "orders"."OrderID",
    "orders"."OrderDate",
    "orders"."RequiredDate",
    "orders"."ShippedDate",
    "orders"."Freight",
    "orders"."ShipAddress",
    "orders"."ShipCity",
    "orders"."ShipRegion",
    "orders"."ShipPostalCode",
    "orders"."ShipCountry",
    "orders"."ShipName",
    "orders"."CustomerID",
    CONCAT('$', ROUND(SUM("ordersdetails"."UnitPrice"::numeric * "ordersdetails"."Quantity"::numeric), 2)) AS "TotalProductsPrice",
    SUM("ordersdetails"."Quantity"::numeric) AS "TotalQuantity",
    COUNT("ordersdetails"."ProductID") AS "TotalProducts"
  FROM
    "orders"
  LEFT JOIN
    "ordersdetails" ON "orders"."OrderID" = "ordersdetails"."OrderID"
  WHERE
    "orders"."OrderID" = $1
  GROUP BY
    "ordersdetails"."OrderID",
    "orders"."OrderID",
    "orders"."id"
  ;`

  const countQuery = `SELECT
    "ordersdetails"."id",
    CONCAT('$', "ordersdetails"."UnitPrice") AS "UnitPrice",
    CONCAT("ordersdetails"."Discount", '%') AS "Discount",
    CONCAT('$', ROUND(SUM("ordersdetails"."UnitPrice"::numeric * "ordersdetails"."Quantity"::numeric), 2)) AS "TotalProductsPrice",
    SUM("ordersdetails"."Quantity"::numeric) AS "TotalQuantity",
    "products"."ProductName",
    "ordersdetails"."ProductID"
  FROM
    "ordersdetails"
  LEFT JOIN
    "products" ON "ordersdetails"."ProductID" = "products"."ProductID"
  WHERE
    "ordersdetails"."OrderID" = $1
  GROUP BY
    "ordersdetails"."id",
    "products"."ProductName"
  ;`

  const startTime = new Date()

  const selectResult = await client.query(selectQuery, [orderId])
  const selectFinishTime = new Date()
  const selectExecutionTimeToSecond = (selectFinishTime.getTime() - startTime.getTime()) / 1000

  for (let i = 0; i < selectResult.rows.length; i++) {
    const orderDate = selectResult.rows[i].OrderDate
    const requiredDate = selectResult.rows[i].RequiredDate
    const shippedDate = selectResult.rows[i].ShippedDate

    const formattedOrderDate = new Date(orderDate).toLocaleDateString('en-US')
    const formattedRequiredDate = new Date(requiredDate).toLocaleDateString('en-US')
    const formattedShippedDate = new Date(shippedDate).toLocaleDateString('en-US')

    selectResult.rows[i].OrderDate = formattedOrderDate
    selectResult.rows[i].RequiredDate = formattedRequiredDate
    selectResult.rows[i].ShippedDate = formattedShippedDate
  }

  const countResult = await client.query(countQuery, [orderId])
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
  const selectedDataProduct = countResult.rows
  let result = {
    sqlLog: [selectSqlLog, countSqlLog],
    order: selectedData,
    products: selectedDataProduct,
  }

  return result
}

export { selectOrders, selectSingleOrder }
