const express = require("express");
const cors = require("cors");

const { MongoClient, ObjectId } = require("mongodb");
require("dotenv").config();

// Create an Express app
const app = express();
const port = process.env.PORT || 5000;

// Middleware setup
app.use(cors());
app.use(express.json());

// MongoDB connection setup
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Asynchronous function to connect to MongoDB and start the server
async function run() {
  try {
    await client.connect(); // Connect to MongoDB
    console.log("Connected to MongoDB");

    // Access the "products" collection in the "fresh-market" database
    const productsCollection = client.db("fresh-market").collection("products");

    // Route to get all products
    app.get("/api/v1/products", async (req, res) => {
      const result = await productsCollection.find().toArray();

      res.json(result);
    });

    // Route to get a single product by its ID
    app.get("/api/v1/products/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await productsCollection.findOne(query);
      res.send(result);
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  } finally {
  }
}

run().catch(console.dir);

// Test route
app.get("/", (req, res) => {
  const serverStatus = {
    message: "Server is running smoothly",
    timestamp: new Date(),
  };
  res.json(serverStatus);
});
