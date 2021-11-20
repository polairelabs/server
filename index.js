const express = require('express')
const app = express()
const port = 5001

const mongo = require('./db/conn');
const orginBaseUrl = 'http://localhost:3000';

mongo.connectToServer(()=>{
    console.log("Successfully connected to MongoDB.");
});

app.get('/shoes/random', async (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', orginBaseUrl);

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

app.get('/shoes/search', async (req, res) => {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', orginBaseUrl);

    const database = mongo.getDb();

    if (database) { 
        var query = req.query.query? req.query.query : "";

        if (query) {
            query = query.replace(/\s\s+/g, ' ');
            var terms = query.split(' ');
            terms.forEach((term, i, arr) => {
                if (term.includes('-')) {
                    arr[i] = term.split('-')[0];
                }
            })
            query = terms.join(' ');
        }

        database.collection("nikeshoes")
        .find({$text: {$search: query}})
        .limit(5)
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
