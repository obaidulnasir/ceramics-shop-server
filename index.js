const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
var cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const email = require("mongodb").email;
require('dotenv').config();
const port = process.env.PORT || 5000;


//middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    console.log('database connect');
    
    //Ceramics database
    const ceramicsShop = client.db("ceramicsShop");
    //Products Collection
    const products = ceramicsShop.collection("products");
    //Customer Collection
    const customer = ceramicsShop.collection("customer");
    //Purchase Collection
    const purchase = ceramicsShop.collection("purchase");

    app.post("/addProducts", async(req, res)=>{
        console.log("add products hitted")
    });
    // add customer 
    app.post("/addCustomer", async(req, res)=>{
        console.log("add user hitted");
        const newUser = req.body;
        const result = await customer.insertOne(newUser);
        res.send(result);
    });

    //ADD Products
    app.post("/addProduct", async(req, res)=>{
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      console.log(result);
      res.send(result);
    });
    //ALL Products 
    app.get("/allProducts", async (req, res)=>{
      const result = await products.find({}).toArray();
      res.send(result);
    })
    
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})