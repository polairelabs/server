const { MongoClient } = require("mongodb");
const keys = require('../config/keys');

const client = new MongoClient(keys.ATLAS_URI);

let dbConnection = undefined;

module.exports = {
  connectToServer: function (callback) {
    client.connect(function (err, db) {
      if (err || !db) {
        return callback(err);
      }

      dbConnection = db.db("nike_shoes");
      return callback();
    });
  },

  getDb: function () {
    return dbConnection;
  },
};