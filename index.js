require("dotenv").config();
const express = require("express");

const app = express();

// Connecting mongoDB
const { MongoClient, ObjectId, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
const dbName = "blogs";
client.connect();

// collections aanroepen
const db = client.db(dbName);
const posts = db.collection("blogposts");

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Define routes
app.get("/", async function (req, res) {
    try {
      // Retrieve all posts from the database
      const allPosts = await posts.find().toArray();
  
      // Render the index template and pass the posts data
      res.render("pages/index", { posts: allPosts });
    } catch (err) {
      console.error("Error retrieving posts:", err);
      res.status(500).send("Internal Server Error");
    }
  });

  // Define route for individual posts
  app.get("/posts/:postId", async function (req, res) {
    try {
      const postId = req.params.postId;
      const post = await posts.findOne({ _id: new ObjectId(postId) });

      if (!post) {
        res.status(404).send("Post not found");
        return;
      }

      res.render("pages/post", { post: post });
    } catch (err) {
      console.error("Error retrieving post:", err);
      res.status(500).send("Internal Server Error");
    }
  });
  

app.get("/newpost", function (req, res) {
  res.render("pages/newpost");
});

// zoekresultaten page
app.post("/posts", async (req, res) => {
  try {
    // Construct a document
    const newblog = {
      titleBlog: req.body.title,
      author: req.body.author,
      tags: req.body.tags.split(",").map(tag => tag.trim()),
      content: req.body.content,
    };

    // Insert a single document, wait for promise so we can read it back
    await posts.insertOne(newblog);

    res.render("pages/succes");
  } catch (err) {
    console.log(err.stack);
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
