require("dotenv").config();
const express = require("express");
const multer = require("multer");
const path = require("path");

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

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// collections aanroepen
const db = client.db(dbName);
const posts = db.collection("blogposts");

// Set up middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Configure Multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads"); // Destination folder for storing uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });



// Define routes
app.get("/", async function (req, res) {
  try {
    // Retrieve all posts from the database
    const allPosts = await posts.find().toArray();

    function getClassForTag(tag) {
        
        // Check if tag is an array
        if (Array.isArray(tag)) {
            // Extract the first element of the array
            if (tag.length > 0) {
                tag = tag[0];
            } else {
                console.log("Empty tag array, default class applied.");
                return "default-class";
            }
        }
        
        // Check if tag is defined and is a string
        if (typeof tag === 'string') {
            // Trim whitespace from the tag
            tag = tag.trim();
            console.log("Trimmed tag value:", tag);
            
            // Check the trimmed tag value
            if (tag === "HTML") {
                return "html-class";
            } else if (tag === "CSS") {
                return "css-class";
            } else if (tag === "JS") {
                return "js-class";
            }
        }
        
        // If tag is not a string or doesn't match any condition, return default class
        return "default-class";
    }
    
    
    
    // Render the index template and pass the posts data
    res.render("pages/index", { posts: allPosts, getClassForTag });
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

// Define route for editing a post
app.get("/posts/:postId/edit", async (req, res) => {
  try {
    const postId = req.params.postId;
    // Retrieve the post from the database by ID
    const post = await posts.findOne({ _id: new ObjectId(postId) });

    if (!post) {
      return res.status(404).send("Post not found");
    }

    // Render the edit post form and pass the post data
    res.render("pages/editpost", { post: post });
  } catch (err) {
    console.error("Error retrieving post:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for updating a post
app.post("/posts/:postId/edit", upload.single("image"), async (req, res) => {
  try {
    const postId = req.params.postId;
    const updatedPostData = {
      image: `/uploads/${req.file.filename}`,
      Gastnaam: req.body.guestName,
      FunctieGast: req.body.guestJob,
      Quote: req.body.guestQuote,
      Bedrfijfsurl: req.body.guestCompany,
      Skills: req.body.guestSkillset,
      Mail: req.body.guestMail,
      Social: req.body.guestSocial,
      GastlesNR: parseInt(req.body.guestNumber),
      GastlesThema: req.body.guestTheme,
      GastlesDatum: req.body.guestDate,
      Tags: req.body.tags.split(",").map((tag) => tag.trim()),
      Content: req.body.quillContent,
    };
    // Update the post in the database
    await posts.updateOne(
      { _id: new ObjectId(postId) },
      { $set: updatedPostData }
    );

    // Redirect to the post page with the success message as a query parameter
    res.redirect(`/posts/${postId}`);
  } catch (err) {
    console.error("Error updating post:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for deleting a post
app.post("/posts/:postId/remove", async (req, res) => {
  try {
    const postId = req.params.postId;
    // Delete the post from the database
    await posts.deleteOne({ _id: new ObjectId(postId) });

    // Redirect to the overview page
    res.redirect("/");
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Define route for creating a new post
app.get("/newpost", function (req, res) {
  res.render("pages/newpost");
});

// zoekresultaten page
app.post("/posts", upload.single("image"), async (req, res) => {
  try {

    const quillContent = req.body.quillContent;
  console.log("Quill content:", quillContent);
    // Construct a document
    const newblog = {
      image: `/uploads/${req.file.filename}`,
      Gastnaam: req.body.guestName,
      FunctieGast: req.body.guestJob,
      Quote: req.body.guestQuote,
      Bedrfijfsurl: req.body.guestCompany,
      Skills: req.body.guestSkillset,
      Mail: req.body.guestMail,
      Social: req.body.guestSocial,
      GastlesNR: parseInt(req.body.guestNumber),
      GastlesThema: req.body.guestTheme,
      GastlesDatum: req.body.guestDate,
      Tags: req.body.tags.split(",").map((tag) => tag.trim()),
      Content: req.body.quillContent,
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
