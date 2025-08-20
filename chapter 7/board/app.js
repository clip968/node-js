const express = require("express");
const handlebars = require("express-handlebars");
const app = express();
const mongodbConnection = require("./configs/mongodb-connection");
const postService = require("./services/post-service");
const { ObjectId } = require("mongodb");

app.engine(
  "handlebars",
  handlebars.create({
    helpers: require("./configs/handlebars-helpers"),
  }).engine
);
app.set("view engine", "handlebars");
app.set("views", __dirname + "/views");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const search = req.query.search || "";
  try {
    const [posts, paginator] = await postService.list(collection, page, search);
    console.log("조회된 글 개수:", posts.length);
    if (posts.length > 0) {
      console.log("첫 번째 글 ID:", posts[0]._id);
    }
    res.render("home", { title: "테스트 게시판", posts, paginator, search });
  } catch (error) {
    console.error(error);
    res.render("home", { title: "테스트 게시판" });
  }
});

app.get("/write", (req, res) => {
  res.render("write", { title: "글쓰기", mode: "create" });
});

app.post("/write", async (req, res) => {
  try {
    console.log("글 작성 요청:", req.body);
    const post = req.body;
    console.log("컬렉션 상태:", collection ? "연결됨" : "연결안됨");
    const result = await postService.writePost(collection, post);
    console.log("글 작성 결과:", result);
    res.redirect(`/detail/${result.insertedId}`);
  } catch (error) {
    console.error("글 작성 오류:", error);
    res.render("write", {
      title: "글쓰기",
      mode: "create",
      error: "글 작성 중 오류가 발생했습니다.",
    });
  }
});

app.get("/modify/:id", async (req, res) => {
  const post = await postService.getPostById(collection, req.params.id);
  console.log(post);
  res.render("write", { title: "글수정", mode: "modify", post });
});

app.post("/modify", async (req, res) => {
  const { id, title, writer, password, content } = req.body;

  const post = {
    title,
    writer,
    password,
    content,
    createdDt: new Date().toISOString(),
  };
  const result = await postService.updatePost(collection, id, post);
  res.redirect(`/detail/${id}`);
});

app.post("/check-password", async (req, res) => {
  const { id, password } = req.body;
  const post = await postService.getPostByIdAndPassword(collection, {
    id,
    password,
  });
  if (!post) {
    return res.status(404).json({ isExist: false });
  } else {
    return res.json({ isExist: true });
  }
});

app.get("/detail/:id", async (req, res) => {
  try {
    console.log("요청된 ID:", req.params.id);
    if (!ObjectId.isValid(req.params.id)) {
      return res.render("detail", {
        title: "상세 페이지",
        error: "유효하지 않은 글 ID입니다.",
      });
    }
    const result = await postService.getDetailPost(collection, req.params.id);
    console.log("조회 결과:", result);
    if (result && result.value) {
      res.render("detail", { title: "상세 페이지", post: result.value });
    } else {
      console.log("글을 찾을 수 없습니다.");
      res.render("detail", {
        title: "상세 페이지",
        error: "글을 찾을 수 없습니다.",
      });
    }
  } catch (error) {
    console.error("상세 페이지 오류:", error);
    res.render("detail", {
      title: "상세 페이지",
      error: "오류가 발생했습니다.",
    });
  }
});

app.delete("/delete", async (req, res) => {
  const { id, password } = req.body;
  try {
    const result = await collection.deleteOne({
      _id: ObjectId(id),
      password: password,
    });
    if (result.deletedCount !== 1) {
      console.log("삭제 실패");
      return res.status(404).json({ isSuccess: false });
    }
    return res.json({ isSuccess: true });
  } catch (error) {
    console.error("삭제 오류:", error);
    res.status(500).json({ isSuccess: false, error: error.message });
  }
});

let collection;
app.listen(3000, async () => {
  console.log("Server is running on port 3000");
  try {
    const mongoClient = await mongodbConnection();
    collection = mongoClient.db().collection("post");
    console.log("MongoDB 연결 성공");
    console.log("데이터베이스 이름:", mongoClient.db().databaseName);
  } catch (error) {
    console.error("MongoDB 연결 실패:", error);
  }
});
