import XLSX from 'xlsx'
import fs from 'node:fs/promises'

let course = process.argv[2]
let url = "data/november.xlsx"
let courses =(await fs.readFile('courseCodes', {encoding: 'utf8'})).trim().split("\n")
let result = {}
// result["grandTotal"] = 0
let grandTotal = 0

let workbook = XLSX.readFile(url)
// let sheet_name_list = workbook.SheetNames
let xlData = XLSX.utils.sheet_to_json(workbook.Sheets["Per kurs"])
let courseData = xlData.filter(function(temp) {
  return courses.includes(temp['kurskod '])
})

function roundShit (num) {
  return  Math.round((num  * 100) / 100)
}
function formatNumber(x) {
    return new Intl.NumberFormat('sv-SE', { style: 'currency', currency: 'SEK' }).format(
      x
    )
}
for (const course of courses) {
  let obj = {
    "HST": 0,
    "HPR": 0,
    "HP": 0,
    "HST_kr_stat": 0,
    "HPR_kr_stat": 0,
    "studAntal": 0,
    "total": 0
  }

  result[course] = []

  for (const item of courseData) {
    if (item["kurskod "] === course) {
      obj["HST"] += roundShit(parseFloat(item["HST "]))
      obj["HPR"] += roundShit(parseFloat(item["HPR "]))
      obj["HP"] = parseFloat(item["hp "])
      obj["HST_kr_stat"] += roundShit(parseFloat(item["HST kr (stat) "]))
      obj["HPR_kr_stat"] += roundShit(parseFloat(item["HPR kr (stat) "]))
      obj["studAntal"] += parseInt(item["Antal stud "])
      obj["total"] += roundShit(parseFloat(item["HST kr (stat) "]) + parseFloat(item["HPR kr (stat) "]))
      obj["prest_grad"] = roundShit(parseFloat((obj["HPR"]/obj["HST"])*100)) + "%"
    }
  }
  result[course] = obj
}

for (const course of courses) {
  grandTotal += roundShit(result[course]["HST_kr_stat"] + result[course]["HPR_kr_stat"])
  result[course]["HST_kr_stat"] = formatNumber(result[course]["HST_kr_stat"])
  result[course]["HPR_kr_stat"] = formatNumber(result[course]["HPR_kr_stat"])
  result[course]["total"] = formatNumber(result[course]["total"])
}
// grandTotal = formatNumber(grandTotal)

console.table(result)
console.table({"Grand Total": formatNumber(grandTotal)})
