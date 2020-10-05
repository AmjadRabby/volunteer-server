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

    //insert data
    app.post("/addEvent", (req, res) => {
      console.log(req.body)
      const volunteerItem = req.body;     
      volunteerCollection.insertOne(volunteerItem)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })

    //all data load
    app.get('/volunteerTasks', (req, res) => {
      volunteerCollection.find({})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    //single data load
    app.get('/volunteerTask/:id', (req, res) => {
        console.log(req.params.id)
      volunteerCollection.find({_id: ObjectId(req.params.id)})      
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
    })

    //registerCollection
    app.post("/addRegister", (req, res) => {
      const registerItem = req.body;     
      registerCollection.insertOne(registerItem)
      .then(result => {
        res.send(result.insertedCount > 0);
      })
    })

    //single email data load
    app.get('/volunteerRegister', (req, res) => {  
      // console.log(req.query.email)   
      registerCollection.find({email: req.query.email})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    //Admin
    app.get('/adminEvent', (req, res) => {     
      registerCollection.find({})      
      .toArray((err, documents) => {
        res.send(documents);
      })
    })

    //delete data
    app.delete('/delate/:id', (req, res) => {  
      // console.log(req.params.id)   
      registerCollection.deleteOne({_id: ObjectId(req.params.id)})      
      .then(result => {
       res.send(result.deletedCount > 0)
        
      })
    })
    app.delete('/adminDelate/:id', (req, res) => {  
      console.log(req.params.id)   
      registerCollection.deleteOne({_id: ObjectId(req.params.id)})      
      .then(result => {
        console.log(result)
        
      })
    })
});





app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(process.env.PORT || port)
