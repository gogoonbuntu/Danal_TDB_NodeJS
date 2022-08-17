/*
npm install express
npm install axios
npm install iconv-lite
npm install body_parser
npm install child_process
npm install ejs (error 페이지에만 사용)
*/



const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')

const app = express()

const { ReadyFunction } = require("./Ready")
const { CPCGIFunction } = require("./CPCGI")

const jsonData = JSON.parse(require('fs').readFileSync('./conf.json', 'utf8'))
exports.jsonData = jsonData

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:false}))

app.get('/Ready', (req, res) => {
    (async()=>{
        let resform = await ReadyFunction()
        res.send(resform)
    })()
})

app.post('/CPCGI', (req, res) => {
    CPCGIFunction(req.body).then(resform=>res.send(resform))
})

app.post('/Success', (req, res) => {
	res.render(path.join(__dirname, "public/Success.ejs"), { 
        BgColor:jsonData.BgColor,
        URL:jsonData.serverAddr + jsonData.CIURL
    })
})

app.post('/Error', (req, res) => {
	res.render(path.join(__dirname, "public/Error.ejs"), {
        BackURL:jsonData.serverAddr + jsonData.BackURL,
        URL:jsonData.serverAddr + jsonData.CIURL,
        Result:req.body['Result'],
        ErrMsg:req.body['ErrMsg']
    })
})

app.post('/BackURL', (req, res) => {
	//실패시 뒤로가기 버튼을 누르면 이동할 페이지를 연결
})

app.listen(3003, () => {
  console.log('Express App on port 3003!')
})
