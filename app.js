
const express = require('express')
const app = express()
const port = 8080

app.set('view engine', 'ejs')

dbuser = process.env.DBUSER
dbpassword = process.env.DBPASSWORD
dbname = process.env.DBNAME
dbhost = process.env.DBHOST
dbport = process.env.DBPORT || 27017

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://' + dbuser + ':' + dbpassword + '@' + dbhost + ':' + dbport
let db
let collection

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
    .then(result => { res.render('index.ejs', {count: result.value.value}) } )
    .catch(error => { /* TODO error page*/ } )

    
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

