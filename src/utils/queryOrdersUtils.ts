// import { Client } from 'pg'

// async function selectOrders(client: Client, page: number, limit: number) {
//   const offset = (page - 1) * limit // Обчислення зміщення для вибірки
//   const selectQuery = `SELECT
//   SUM("ordersdetails"."UnitPrice"::numeric * "ordersdetails"."Discount"::numeric * "ordersdetails"."Quantity"::numeric) AS "TotalProductsDiscount",
//   SUM("ordersdetails"."UnitPrice"::numeric * "ordersdetails"."Quantity"::numeric) AS "TotalProductsPrice",
//   SUM("ordersdetails"."Quantity") AS "TotalProductsItems",
//   COUNT("ordersdetails"."OrderID") AS "TotalProducts",
//   "orders"."OrderID",
//   "orders"."CustomerID",
//   "orders"."OrderDate",
//   "orders"."RequiredDate",
//   "orders"."ShippedDate",
//   "orders"."Freight",
//   "orders"."ShipName",
//   "orders"."ShipAddress",
//   "orders"."ShipCity",
//   "orders"."ShipRegion",
//   "orders"."ShipPostalCode",
//   "orders"."ShipCountry",
//   "ordersdetails"."ProductID"
// FROM
//   "orders"
// JOIN
//   "ordersdetails" ON "orders"."OrderID" = "ordersdetails"."OrderID"
// GROUP BY
//   "orders"."OrderID",
//   "orders"."CustomerID",
//   "orders"."OrderDate",
//   "orders"."RequiredDate",
//   "orders"."ShippedDate",
//   "orders"."Freight",
//   "orders"."ShipName",
//   "orders"."ShipAddress",
//   "orders"."ShipCity",
//   "orders"."ShipRegion",
//   "orders"."ShipPostalCode",
//   "orders"."ShipCountry",
//   "ordersdetails"."ProductID"
// OFFSET ${offset} LIMIT ${limit}
// ;`
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

    const countResult = await client.query(countQuery)
    const countFinishTime = new Date()
    const countExecutionTimeToSecond =
      (countFinishTime.getTime() - selectFinishTime.getTime()) / 1000

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

export { selectOrders }
