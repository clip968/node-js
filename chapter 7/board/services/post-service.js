const { ObjectId } = require("mongodb");

async function writePost(collection, post) {
  post.hits = 0;
  post.createdDt = new Date().toISOString();
  return await collection.insertOne(post);
}

const paginator = require("../utils/paginator");

async function list(collection, page, search) {
  const perPage = 10;
  const query = { title: new RegExp(search, "i") };
  const cursor = collection
    .find(query, { limit: perPage, skip: (page - 1) * perPage })
    .sort({ createdDt: -1 });
  const totalCount = await collection.countDocuments(query);
  const posts = await cursor.toArray();
  const paginatorObj = paginator({ totalCount, page, perPage: perPage });
  return [posts, paginatorObj];
}

const projectiononOption = {
  projection: {
    password: 0,
    "comments.password": 0,
  },
};

async function getDetailPost(collection, id) {
  console.log("getDetailPost 호출됨 - ID:", id, "타입:", typeof id);
  console.log("ObjectId.isValid(id):", ObjectId.isValid(id));

  // 먼저 단순 조회로 문서가 존재하는지 확인
  const simpleQuery = ObjectId.isValid(id)
    ? { _id: new ObjectId(id) }
    : { _id: id };
  const exists = await collection.findOne(simpleQuery);
  console.log("문서 존재 여부:", exists ? "존재함" : "존재하지 않음");

  if (!exists) {
    return null;
  }

  // 조회수 증가 후 업데이트된 문서 반환
  await collection.updateOne(simpleQuery, { $inc: { hits: 1 } });
  const updatedDoc = await collection.findOne(simpleQuery, projectiononOption);

  console.log("최종 반환 문서:", updatedDoc ? "있음" : "없음");
  return { value: updatedDoc };
}

async function getPostByIdAndPassword(collection, { id, password }) {
  const filter = ObjectId.isValid(id)
    ? {
        $or: [
          { _id: new ObjectId(id), password },
          { _id: id, password },
        ],
      }
    : { _id: id, password };
  return await collection.findOne(filter, projectiononOption);
}

async function getPostById(collection, id) {
  const filter = ObjectId.isValid(id)
    ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
    : { _id: id };
  return await collection.findOne(filter, projectiononOption);
}

async function updatePost(collection, id, post) {
  const toUpdatePost = {
    $set: {
      ...post,
    },
  };
  const filter = ObjectId.isValid(id)
    ? { $or: [{ _id: new ObjectId(id) }, { _id: id }] }
    : { _id: id };
  return await collection.updateOne(filter, toUpdatePost);
}

module.exports = {
  writePost,
  list,
  getDetailPost,
  getPostByIdAndPassword,
  getPostById,
  updatePost,
};
