import dotenv from 'dotenv'
import { Client } from 'pg'
import { readEmployeesFromFile } from './employeesReadAndFix'
import { createTableAndInsertOrders } from './ordersConnect'
import { createTableAndInsertEmployees } from './employeesConnect'
import { createTableAndInsertDetails } from './ordersDetailsConnect'
import { readOrdersDetailsFromFile, readOrdersFromFile } from './ordersReadAndFix'
import { createTableAndInsertProduct, readProductsFromFile } from './productConnect'
import { createTableAndInsertCustomer, readCustomersFromFile } from './customersConnect'
import { readSuppliersFromFile, createTableAndInsertSuppliers } from './suppliersConnect'
dotenv.config()

const createAndRead = async (client: any) => {
  const productsInfo = await readProductsFromFile()
  const resultProduct = await createTableAndInsertProduct(client, productsInfo)

  const customersInfo = await readCustomersFromFile()
  const resultCustomer = await createTableAndInsertCustomer(client, customersInfo)

  const suppliersInfo = await readSuppliersFromFile()
  const resultSuppliers = await createTableAndInsertSuppliers(client, suppliersInfo)

  const employeesInfo = await readEmployeesFromFile()
  const resultEmployees = await createTableAndInsertEmployees(client, employeesInfo)

  const ordersInfo = await readOrdersFromFile()
  const resultOrders = await createTableAndInsertOrders(client, ordersInfo)

  const ordersDetailsInfo = await readOrdersDetailsFromFile()
  const resultDetails = await createTableAndInsertDetails(client, ordersDetailsInfo)
}

export { createAndRead }
