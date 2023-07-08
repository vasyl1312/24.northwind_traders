import dotenv from 'dotenv'
import { Client } from 'pg'
import { readEmployeesFromFile } from './employeesReadAndFix'
import { createTableAndInsertEmployees } from './employeesConnect'
import { createTableAndInsertDetails } from './ordersDetailsConnect'
import { createTableAndInsertProduct, readProductsFromFile } from './productConnect'
import { createTableAndInsertShippers, readShippersFromFile } from './shippersConnect'
import { createTableAndInsertCustomer, readCustomersFromFile } from './customersConnect'
import { readSuppliersFromFile, createTableAndInsertSuppliers } from './suppliersConnect'
import { createTableAndInsertOrders1, readOrders1FromFile } from './orders1Connect'
dotenv.config()

const createAndRead = async (client: any) => {
  // const productsInfo = await readProductsFromFile()
  // const resultProduct = await createTableAndInsertProduct(client, productsInfo)
  // const customersInfo = await readCustomersFromFile()
  // const resultCustomer = await createTableAndInsertCustomer(client, customersInfo)
  // const suppliersInfo = await readSuppliersFromFile()
  // const resultSuppliers = await createTableAndInsertSuppliers(client, suppliersInfo)
  // const employeesInfo = await readEmployeesFromFile()
  // const resultEmployees = await createTableAndInsertEmployees(client, employeesInfo)
  // const ordersInfoDeta = await readOrdersDetailsFromFile()
  // const resultOrders = await createTableAndInsertDetails(client, ordersInfoDeta)
  // const shippersDetailsInfo = await readShippersFromFile()
  // const resultShippers = await createTableAndInsertShippers(client, shippersDetailsInfo)
  // const ordersInfo = await readOrders1FromFile()
  // const resultOrders = await createTableAndInsertOrders1(client, ordersInfo)
}

export { createAndRead }
