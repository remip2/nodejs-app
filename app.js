
const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'ejs')

dbuser = process.env.DBUSER
dbpassword = process.env.DBPASSWORD
dbname = process.env.DBNAME
dbhost = process.env.DBHOST

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://' + dbuser + ':' + dbpassword + '@' + dbhost + ':27017'
let db
let collection

let status = true

MongoClient.connect(url).then(client => {
  console.log("Connected successfully to mongo")
  db = client.db(dbname)
  collection = db.collection("counters")
});

app.get('/', (req, res) => {
    let count = 0
    collection.findOneAndUpdate(
        { name:'counter1' },
        { $inc: {value: 1} },
        { upsert: true }
    )
    .then(result => { res.render('index.ejs', {count: result.value.value, status: status}) } )
    .catch(error => { /* TODO error page*/ } )

    
})

app.get('/status', (req, res) => {
  if (status) {
    res.send("All good")
  } else {
    res.status(500).send("Something wrong")
  }
})

app.get('/toggle', (req, res) => {
  status = !status
  res.send("<h3>Status changed<p><a href='/'>back</a>")
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

