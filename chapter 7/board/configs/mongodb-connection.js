const { MongoClient } = require("mongodb");

const uri =
  "mongodb+srv://namjaejun473:!operation050!@cluster0.se2kaea.mongodb.net/board";

module.exports = async function () {
  try {
    const client = await MongoClient.connect(uri);
    console.log("MongoDB 클라이언트 연결 성공");
    return client;
  } catch (error) {
    console.error("MongoDB 연결 중 오류:", error);
    throw error;
  }
};
