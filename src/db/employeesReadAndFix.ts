import * as dotenv from 'dotenv'
import csv from 'csv-parser'
import { createReadStream } from 'fs'
dotenv.config()

async function readEmployeesFromFile(): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const results: any[] = []
    let dataFromFiveLength: any = null
    let dataFromSevenLength: any = null

    createReadStream('Telegram Archive/Employees.csv')
      .pipe(csv())
      .on('data', (data) => {
        switch (results.length) {
          case 0:
            data.Name = `${data.FirstName} ${data.LastName}`
            data.ReportsTo = data.Notes.slice(-1)
            data.Notes = data.Notes.slice(0, -2)
            break

          case 1:
            data.Name = `${data.FirstName} ${data.LastName}`
            data.Title = `${data.Title}, ${data.TitleOfCourtesy}`
            data.TitleOfCourtesy = `${data.BirthDate}`
            data.BirthDate = `${data.HireDate}`
            data.HireDate = `${data.Address}`
            data.Address = `${data.City}`
            data.City = `${data.Region}`
            data.Region = `${data.PostalCode}`
            data.PostalCode = `${data.Country}`
            data.Country = `${data.HomePhone}`
            data.HomePhone = `${data.Extension}`
            data.Extension = `${data.Notes}`
            data.Notes = `${data.ReportsTo}${data._16}${data._17}${data._18}`
            data.ReportsTo = null
            break

          case 2:
            data.Name = `${data.FirstName} ${data.LastName}`
            break

          case 3:
            data.Name = `${data.FirstName} ${data.LastName}`
            break

          case 4:
            data.Name = `${data.FirstName} ${data.LastName}`
            data.Notes = `${data.Notes}${data.ReportsTo}${data._16}`
            data.ReportsTo = `${data._17.slice(-1)}`
            let fixNotes = `${data._17.slice(0, -2)}`
            data.Notes += fixNotes
            break

          case 5:
            dataFromFiveLength = { ...data }
            break

          case 6:
            if (dataFromFiveLength) {
              data.Name = `${dataFromFiveLength.FirstName} ${dataFromFiveLength.LastName}`
              data.ReportsTo = `${data.Country.slice(-1)}`
              data.Notes = `${dataFromFiveLength.Address}${data.City}${data.Region}${
                data.PostalCode
              }${data.Country.slice(0, -2)}`
              data.Address = `${dataFromFiveLength.Address} ${data.EmployeeID}`
              data.City = `${data.LastName}`
              data.PostalCode = `${data.Title}`
              data.Country = `${data.TitleOfCourtesy}`
              data.HomePhone = `${data.BirthDate}`
              data.Extension = `${data.HireDate}`
              data.Title = `${dataFromFiveLength.Title}`
              data.TitleOfCourtesy = `${dataFromFiveLength.TitleOfCourtesy}`
              data.BirthDate = `${dataFromFiveLength.BirthDate}`
              data.HireDate = `${dataFromFiveLength.HireDate}`
              data.EmployeeID = `${dataFromFiveLength.EmployeeID}`
            }
            break

          case 7:
            dataFromSevenLength = { ...data }
            break

          case 8:
            if (dataFromSevenLength) {
              data.ReportsTo = `${data.City.slice(-1)}`
              data.Notes = `${data.Address}${data.City.slice(0, -2)}`
              data.Name = `${dataFromSevenLength.FirstName} ${dataFromSevenLength.LastName}`
              data.Address = `${dataFromSevenLength.Address} ${data.EmployeeID}`
              data.EmployeeID = `${dataFromSevenLength.EmployeeID}`
              data.City = `${data.LastName}`
              data.PostalCode = `${data.Title}`
              data.Title = `${dataFromSevenLength.Title}`
              data.Country = `${data.TitleOfCourtesy}`
              data.TitleOfCourtesy = `${dataFromSevenLength.TitleOfCourtesy}`
              data.HomePhone = `${data.BirthDate}`
              data.BirthDate = `${dataFromSevenLength.BirthDate}`
              data.Extension = `${data.HireDate}`
              data.HireDate = `${dataFromSevenLength.HireDate}`
            }
            break

          case 9:
            data.Name = `${data.FirstName} ${data.LastName}`
            break

          case 10:
            data.Name = `${data.FirstName} ${data.LastName}`
            break
        }
        results.push(data)
      })
      .on('end', () => {
        const newResults: any[] = results.filter((_, index) => index !== 5 && index !== 7) //видаляєм непортрібні дані

        resolve(newResults)
      })
      .on('error', (error) => {
        reject(error)
      })
  })
}

export { readEmployeesFromFile }
