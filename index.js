const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

//Middle ware
app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.6urwpmq.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const restaurantItemCollection = client
      .db("testycDB")
      .collection("restaurantItem");
    const userOrder = client.db("testycDB").collection("order");
    const registeruser = client.db("testycDB").collection("user");
    const userAddItemCollection = client.db("testycDB").collection("userItem");

    //user added food item display operation
    app.get("/userItem", async (req, res) => {
      let query = {};
      if (req.query?.email) {
        query = { email: req.query.email };
      }
      const cursor = userAddItemCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //user add food item operation
    app.post("/userItem", async (req, res) => {
      const userItem = req.body;
      const result = await userAddItemCollection.insertOne(userItem);
      res.send(result);
    });
    //user operation
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await registeruser.insertOne(user);
      res.send(result);
    });
    // user order operation
    app.post("/order", async (req, res) => {
      const order = req.body;
      const result = await userOrder.insertOne(order);
      res.send(result);
    });
    app.get("/order", async (req, res) => {
      let query = {};
      if (req.query?.buyerEmail) {
        query = { buyerEmail: req.query.buyerEmail };
      }
      const cursor = userOrder.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    //user order delete operation
    app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userOrder.deleteOne(query);
      res.send(result);
    });

    //restaurant item operation

    app.get("/restaurantItemCount", async (req, res) => {
      const count = await restaurantItemCollection.estimatedDocumentCount();
      res.send({ count });
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//primary operation
app.get("/", (req, res) => {
  res.send("Simple CRUD is Runing");
});
app.listen(port, () => {
  console.log(`simple crud is runing ${port}`);
});
