import XLSX from 'xlsx'
import fs from 'node:fs/promises'

let course = process.argv[2]
let url = "data/november.xlsx"
let courses =(await fs.readFile('courseCodes', {encoding: 'utf8'})).split("\n")
let result = {}

let workbook = XLSX.readFile(url)
// let sheet_name_list = workbook.SheetNames
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Per kurs"])
let courseData = xlData.filter(function(temp) {
  return courses.includes(temp['kurskod '])
})

for (const course of courses) {
  result[course] = []
  for (const item of courseData) {
    if (item["kurskod "] === course) {
      result[course].push(
        {
          "HST": item["HST "],
          "HPR": item["HPR "],
          "HP": item["hp "],
          "HST_kr_stat": item["HST kr (stat) "],
          "HPR_kr_stat": item["HPR kr (stat) "],
          "studAntal": item["Antal stud "],
        }
      )
    }
  }
}

console.log(result)