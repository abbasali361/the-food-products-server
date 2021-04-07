const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const app = express()
const cors = require("cors");
const bodyParser = require('body-parser');
const ObjectId = require("mongodb").ObjectID;
require("dotenv").config();
const port =  6600;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uxcb1.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')

})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productCollection = client.db("foodProducts").collection("products");
  const orderCollection = client.db("foodProducts").collection("order");

  app.get('/products', (req, res) => {
    productCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

  app.post("/addProducts", (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
    .then(result => {
      res.send(result.insertedCount > 0)
    });
  });

  app.get("/checkOut/:id", (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
        console.log("get id",documents[0]);
      });
  });


  app.delete("/deleteProduct/:id", ( req,res) => {
    console.log(req.params.id);
    productCollection.findOneAndDelete({ _id: ObjectId(req.params.id) })
      .then((err, documents) => {
        res.send(!!documents.value);
        console.log(err);
      });
  });

  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order)
    .then(result => {
      res.send(result.insertedCount > 0)
      console.log('order',result.insertedCount);
    });
  });

  app.get('/getOrder', (req, res) => {
    orderCollection.find()
    .toArray((err, items) => {
      res.send(items);
    })
  })

});


app.listen(process.env.PORT||port)