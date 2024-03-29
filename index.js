const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zuwogqz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toysCollection = client.db('ToysDB').collection('toys')

        const latestCollection = client.db('ToysDB').collection('myToys')

        app.get('/latest', async (req, res) => {
            const result = await latestCollection.find().toArray()
            res.send(result)
        })


        app.get('/teddys', async (req, res) => {
            const result = await toysCollection.find().toArray()
            res.send(result)
        })
        app.get('/updateToys', async (req, res) => {
            const result = await toysCollection.find().toArray()
            res.send(result)
        })

        app.get('/updateToys/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const filter = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(filter)
            res.send(result)
        })

        app.get('/teddys/:id', async (req, res) => {
            const id = req.params.id
            // console.log(id);
            const filter = { _id: new ObjectId(id) }
            const result = await toysCollection.findOne(filter)
            res.send(result)
        })


        app.get('/bookings', async (req, res) => {
            // console.log(req.query.Price);

            let query = {}
            if (req.query?.sellerMail) {
                query = { sellerMail: req.query.sellerMail }
            }
            const sort = req?.query?.sort === 'asc' ? 1 : -1

            const result = await toysCollection.find(query).sort({Price: sort}).toArray()
            res.send(result)
        })


        app.get('/tabs', async (req, res) => {
            // console.log(req.query.CategoryName);

            let query = {}
            if (req.query?.CategoryName) {
                query = { CategoryName: req.query.CategoryName }
            }

            const result = await toysCollection.find(query).toArray()
            res.send(result)
        })

        app.post('/teddys', async (req, res) => {
            const newTeddy = req.body
            const result = await toysCollection.insertOne(newTeddy)
            res.send(result)
        })

        app.put('/updateToys/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const updateItem = req.body
            console.log(updateItem);
            const options = { upsert: true };
            const filter = { _id: new ObjectId(id) }
            const updateData = {
                $set: {
                    quantity: updateItem.quantity,
                    Price: updateItem.Price,
                    Rating: updateItem.Rating,
                    description: updateItem.description
                }
            }
            const result = await toysCollection.updateOne(filter, updateData, options)
            res.send(result)
        })

        app.delete('/teddys/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await toysCollection.deleteOne(query)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('toy market is running')
})

app.listen(port, () => {
    console.log(`toy market is running on port ${port}`);
})