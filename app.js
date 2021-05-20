
const express = require('express')
const app = express()
const port = 8080

const util = require('util')

app.set('view engine', 'ejs')

dbuser = process.env.DBUSER
dbpassword = process.env.DBPASSWORD
dbname = process.env.DBNAME
dbhost = process.env.DBHOST

const MongoClient = require('mongodb').MongoClient
const url = 'mongodb://' + dbuser + ':' + dbpassword + '@' + dbhost + ':27017'
let db
let collection

// Import the OBS library.
var ObsClient = require('./obs/lib/obs')

var obsClient = null

// Create an instance of ObsClient.
obsClient = new ObsClient({
    access_key_id: process.env.ACCESS_KEY_ID,       
    secret_access_key: process.env.ACCESS_KEY_SECRET,       
    server : process.env.OBJECT_SERVER
})

/*
obsClient.initLog({
  file_full_path:'./OBS-SDK.log', //Set the path to the log file.
max_log_size:1000000, //Set the size of the log file, in bytes.
backups:1, //Set the maximum number of log files that can be stored.
  level:'debug', //Set the log level.
  log_to_console:true //Set whether to print the log to Console.
  })
*/

let status = true

MongoClient.connect(url).then(client => {
  console.log("Connected successfully to mongo")
  db = client.db(dbname)
  collection = db.collection("counters")
});

const listObj = util.promisify(obsClient.listObjects).bind(obsClient)

app.get('/', (req, res) => {
  
  objects = []

  
  if (obsClient) {
    listObj({ Bucket : 'objtest', Key: 'images' })
      .then( result => {
        if(result.CommonMsg.Status < 300 && result.InterfaceResult){
          for(let j=0;j<result.InterfaceResult.Contents.length;j++){
            objects.push(result.InterfaceResult.Contents[j]['Key']) 
          }
        } else {
          console.error(result)
        }
  
        let count = 0
        collection.findOneAndUpdate(
          { name:'counter1' },
          { $inc: {value: 1} },
          { upsert: true }
        )
        .then(result => { res.render('index.ejs', {count: result.value.value, status: status, objects: objects}) } )
        .catch(error => { /* TODO error page*/ } )

      })
      .catch(err => {
        console.error(err);
      })
  }   
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

