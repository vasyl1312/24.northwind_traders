import express from 'express'
import { readEmployeesFromFile } from '../db/employeesReadAndFix'
import { createTableAndInsertData } from '../db/employeesConnect'
import { selectSingleEmployee } from '../utils/queryEmployeesUtils'

const router = express.Router()

const employeesRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const employeesInfo = await readEmployeesFromFile()
      const result = await createTableAndInsertData(client, employeesInfo, res)

      res.json(result)
    } catch (error) {
      console.error('Error:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  router.get('/:id', async (req, res) => {
    const employeeId = req.params.id
    try {
      const result = await selectSingleEmployee(client, employeeId)

      res.json(result)
    } catch (error) {
      console.error('Error retrieving data from the database:', error)
      res.status(500).send('Internal Server Error')
    }
  })

  return router
}

export default employeesRoutes
