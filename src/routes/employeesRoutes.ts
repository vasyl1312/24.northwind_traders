import express from 'express'
import { readEmployeesFromFile } from '../db/employeesReadAndFix'
import { createTableAndInsertData } from '../db/employeesConnect'
import { selectSingleEmployee } from '../utils/queryEmployeesUtils'

const router = express.Router()

const employeesRoutes = (client: any) => {
  router.get('/', async (req, res) => {
    try {
      const employeesInfo = await readEmployeesFromFile()
      const page = req.query.page ? parseInt(req.query.page.toString(), 10) : 1
      const limit = req.query.limit ? parseInt(req.query.limit.toString(), 10) : 20

      const result = await createTableAndInsertData(client, employeesInfo, res, page, limit)
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
