const express = require("express");
const app = express();
const { MongoClient } = require("mongodb");
var cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const email = require("mongodb").email;
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rmbaw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;



const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("database connect");

    //Ceramics database
    const ceramicsShop = client.db("ceramicsShop");
    //Products Collection
    const products = ceramicsShop.collection("products");
    //Customer Collection
    const customer = ceramicsShop.collection("customer");
    //Purchase Collection
    const purchase = ceramicsShop.collection("purchase");
    //Review Collection
    const review = ceramicsShop.collection("review");
   

    // add customer
    app.post("/addCustomer", async (req, res) => {
      const newUser = req.body;
      const result = await customer.insertOne(newUser);
      res.send(result);
       
    });

    //is Admin
    app.get("/customer/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await customer.findOne(query);
      let isAdmin = false;
      if (user?.role === "admin") {
        isAdmin = true;
      }
      res.json({ admin: isAdmin });
    });
    //Make Admin
    app.put("/makeAdmin", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const updateDoc = { $set: { role: "admin" } };
      const result = await customer.updateOne(filter, updateDoc);
      res.json(result);
     
    });

    //ADD Products
    app.post("/addProduct", async (req, res) => {
      const newProduct = req.body;
      const result = await products.insertOne(newProduct);
      res.send(result);
    });
    //ALL Products
    app.get("/allProducts", async (req, res) => {
      const result = await products.find({}).toArray();
      res.send(result);
    });
    //Delete Single Product
    app.delete('/deleteProduct/:id', async (req, res)=>{
      const deleteEvents = req.params.id;
      const query = {_id: ObjectId(deleteEvents)};
      const result = await products.deleteOne(query);
      res.send(result);
    })

    //Get single products data
    app.get("/product/:id", async (req, res) => {
      const service = req.params.id;

      const query = { _id: ObjectId(service) };
      const result = await products.findOne(query);
      res.send(result);
    });

    //ADD an Order
    app.post("/placeOrder", async (req, res) => {
      const newOrder = req.body;
      const result = await purchase.insertOne(newOrder);
      res.send(result);
     
    });

    //GET my Order
    app.get("/myOrder/:email", async (req, res) => {
      const myEmail = req.params.email;
      const query = { email: myEmail };
      const result = await purchase.find(query).toArray();
      res.send(result);
    });

    // GET ALL Order
    app.get("/allOrders", async (req, res) => {
      const result = await purchase.find({}).toArray();
      res.send(result);
    });

    //DELETE Single Order
    app.delete('/deleteOrder/:id', async (req, res)=>{
      const deleteEvents = req.params.id;
      const query = {_id: ObjectId(deleteEvents)};
      const result = await purchase.deleteOne(query);
      res.send(result);
    })

    //ADD Review
    app.post("/addReview", async (req, res) => {
      const newReview = req.body;
      const result = await review.insertOne(newReview);
      res.send(result);
      
    });
    //GET All Review
    app.get("/allReview", async (req, res) => {
      const result = await review.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
