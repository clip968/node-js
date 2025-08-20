const MongoClient = require("mongodb").MongoClient;

const uri =
  "mongodb+srv://namjaejun473:!operation050!@cluster0.se2kaea.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, { useNewUrlParser: true });

async function main() {
  try {
    await client.connect();

    console.log("Connected to MongoDB");

    const collection = client.db("test").collection("person");

    await collection.insertOne({
      name: "Andy",
      age: 30,
    });

    console.log("Inserted one document");

    const documents = await collection.find({ name: "Andy" }).toArray();
    console.log("찾은 문서 : ", documents);

    await collection.updateOne({ name: "Andy" }, { $set: { age: 31 } });
    console.log("업데이트 완료");

    const updatedDocuments = await collection.find({ name: "Andy" }).toArray();
    console.log("업데이트 후 찾은 문서 : ", updatedDocuments);

    await client.close();
  } catch (err) {
    console.error(err);
  }
}

main();
