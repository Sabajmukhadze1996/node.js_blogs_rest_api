const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
    try {
      if (!req.body.email && !req.body.username && !req.body.password) {
        res.status(401).json({ error: "No fields provided for update!" });
        return;
      }
  
      if (req.body.email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!emailRegex.test(req.body.email)) {
          res.status(405).json({ error: "Please write a correct email!" });
          return;
        }
  
        if (req.body.email.length > 90) {
          res.status(405).json({ error: "Email address is too long. Please provide a shorter email." });
          return;
        }
      }
  
      if (req.body.username && (req.body.username.length < 3 || req.body.username.length > 45)) {
        res.status(405).json({ error: "Username must be 3 to 45 characters long." });
        return;
      }
  
      if (req.body.password && (req.body.password.length < 8 || req.body.password.length > 45)) {
        res.status(405).json({ error: "Password must be 8 to 45 characters long." });
        return;
      }
  
      const updateFields = {};
  
      if (req.body.username) {
        updateFields.username = req.body.username;
      }

      if (req.body.email) {
        updateFields.email = req.body.email;
      }
  
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.password = await bcrypt.hash(req.body.password, salt);
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while updating the user" });
    }
  });
  

router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json("User not found");
    }

    await Post.deleteMany({ email: user.email });
    await User.deleteOne({ _id: req.params.id });

    res.status(200).json("User has been deleted!");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while deleting the user");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
