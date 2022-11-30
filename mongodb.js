const { MongoClient } = require("mongodb");

const connectionURL = process.env.MONGODB_URL;
const databaseName = "task-manager";

const client = new MongoClient(connectionURL, { useNewUrlParser: true });

client.on("eror", () => console.log("Unable to connect to database"));

const db = client.db(databaseName);

db.collection("tasks")
  .deleteOne({ description: "Buy groceries" })
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
