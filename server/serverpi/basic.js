var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello  from 10.0.0.100 World!')
})

var port =2000
app.listen(port, function () {
  console.log('Example app listening on port ', port)
})