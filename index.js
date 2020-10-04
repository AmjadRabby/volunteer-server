const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zxfa1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const app = express()
app.use(bodyParser.json());
app.use(cors());

const port = 5000





const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const volunteerCollection = client.db("volunteerStore").collection("volunteerItem");
  const registerCollection = client.db("volunteerStore").collection("registerInfo");
    // console.log('db connected')

    app.post("/addVolunteerItem", (req, res) => {
      const volunteerItem = req.body;     
      volunteerCollection.insertMany(volunteerItem)
      .then(result => {
        res.send(result.insertedCount);
      })
    })

    app.get('/volunteerTasks', (req, res) => {
      volunteerCollection.find({})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    app.get('/volunteerTask/:id', (req, res) => {
        console.log(req.params.id)
      volunteerCollection.find({_id: ObjectId(req.params.id)})      
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
    })


    app.post("/addRegister", (req, res) => {
      const registerItem = req.body;     
      registerCollection.insertOne(registerItem)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })

    app.get('/volunteerRegister', (req, res) => {  
      console.log(req.query.email)   
      registerCollection.find({email: req.query.email})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    //Admin
    app.get('/volunteerRegister', (req, res) => {     
      registerCollection.find({})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

});













app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)
