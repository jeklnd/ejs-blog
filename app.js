// import modules
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require("dotenv").config()

// initializations
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// connect to database
mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGO_URL);

// define collections
const Post = new mongoose.model("Post", postSchema = new mongoose.Schema ({
  title: String, 
  body: String,
}));

// default content
const homeContent ="Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent ="Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent ="Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const posts = [];

// routes
app.get("/", (req, res) => {
  Post.find((err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.render("home.ejs", {
        homeContent: homeContent,
        posts: result,
      });
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs", {});
});

app.post("/compose", (req, res) => {
  const newPostTitle = req.body.newPostTitle;
  const newPostBody = req.body.newPostBody;
  const newPost = new Post({title: newPostTitle, body: newPostBody});
  newPost.save((err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log('New post saved successfully');
      res.redirect("/");
    }
  });

  
});

app.get("/posts/:postId", (req, res) => {
  const postId = req.params.postId;
  Post.findById(postId, (err, result) => {
    if (err) {
      console.log(err);
    } else {
        res.render("post.ejs", {
          newPostTitle: result.title,
          newPostBody: result.body,
          postId: postId,
        });
    }
  });
});

app.post("/delete", (req, res) => {
  const idForDeletion = req.body.idForDeletion;  
  Post.findById(idForDeletion, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      Post.findByIdAndDelete({_id: idForDeletion}, (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log('Post deleted successfully');
          res.redirect("/");
        }
      });
    }
  });
});

app.listen(process.env.PORT || 5000, () => {
  console.log("Server started on port 5000");
});
