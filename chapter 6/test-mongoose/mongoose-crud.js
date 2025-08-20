const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const Person = require("./person-model");

mongoose.set("strictQuery", false);
const app = express();
app.use(bodyParser.json());
app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  const mongodbUri =
    "mongodb+srv://namjaejun473:!operation050!@cluster0.se2kaea.mongodb.net/test?retryWrites=true&w=majority";

  mongoose
    .connect(mongodbUri, {
      useNewUrlParser: true,
    })
    .then(console.log("MongoDB 연결 성공"))
    .catch((err) => console.error(err));
});

app.get("/person", async (req, res) => {
  const person = await Person.find({});
  res.send(person);
});

app.get("/person/:email", async (req, res) => {
  const person = await Person.findOne({ email: req.params.email });
  res.send(person);
});

app.post("/person", async (req, res) => {
  const person = new Person(req.body);
  await person.save();
  res.send(person);
});

app.put("/person/:email", async (req, res) => {
  const person = await Person.findOneAndUpdate(
    { email: req.params.email },
    { $set: req.body },
    { new: true }
  );
  console.log(person);
  res.send(person);
});

app.delete("/person/:email", async (req, res) => {
  await Person.findOneAndDelete({ email: req.params.email });
  res.send({ success: true });
});
