const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

router.post("/", async (req, res) => {

  //  if (req.body.)

  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updatedPost) {
      return res.status(404).json("Post not found");
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while updating the post");
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    res.status(200).json("Post has been deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while deleting the post");
  }
});

// ანუ იუზერი ნახულობს მხოლოდ თავის რომელიმე ერთ უნიკალურ პოსტს, პოსტის აიდის მიხედვით
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

// იუზერი ნახულობს მხოლოდ ყველა თავის პოსტს
router.get("/", async (req, res) => {
  const email = req.query.email;

  try {
    let posts;
    if (email) {
      posts = await Post.find({ email: email });
    } else {
      posts = await Post.find();
    }

    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

// ყველა ჩემი პოსტის ნახვა და აგრეთვე სხვა მომხმარებლების პოსტების
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
