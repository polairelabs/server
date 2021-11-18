const express = require('express')
const app = express()
const port = 5001

const mongo = require('./db/conn');

mongo.connectToServer(()=>{
    console.log("Successfully connected to MongoDB.");
});

app.get('/shoes/random', async (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3004');

    const database = mongo.getDb();

    if (database) { 
        database.collection("nikeshoes")
        .aggregate([{ $sample: { size: req.query.count? parseInt(req.query.count) : 10 } }])
        .toArray(function (err, result) {
            if (err) {
                res.status(400).send("Error fetching shoes!");
            } else {
                res.json(result);
            }
        });
    }
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
