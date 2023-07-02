const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");
const bcrypt = require("bcrypt");

router.put("/:id", async (req, res) => {
    try {
      if (!req.body.user_email && !req.body.user_name && !req.body.user_password && !req.body.user_mobile_number) {
        res.status(401).json({ error: "No fields provided for update!" });
        return;
      }
  
      if (req.body.user_email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        if (!emailRegex.test(req.body.user_email)) {
          res.status(405).json({ error: "Please write a correct email!" });
          return;
        }
  
        if (req.body.user_email.length > 90) {
          res.status(405).json({ error: "Email address is too long. Please provide a shorter email." });
          return;
        }

        const existingUser = await User.findOne({ user_email: req.body.user_email });
        if (existingUser && existingUser._id.toString() !== req.params.id) {
          res.status(409).json({ error: "Email address already exists for another user!" });
          return;
        }
      }
  
      if (req.body.user_name && (req.body.user_name.length < 3 || req.body.user_name.length > 45)) {
        res.status(405).json({ error: "Username must be 3 to 45 characters long." });
        return;
      }
  
      if (req.body.user_password && (req.body.user_password.length < 8 || req.body.user_password.length > 45)) {
        res.status(405).json({ error: "Password must be 8 to 45 characters long." });
        return;
      }

      if (req.body.user_mobile_number && req.body.user_mobile_number.length > 60) {
        res.status(405).json({ error: "User mobile number cannot exceed 60 characters." });
        return;
      }
  
      const updateFields = {};
  
      if (req.body.user_name) {
        updateFields.user_name = req.body.user_name;
      }

      if (req.body.user_email) {
        updateFields.user_email = req.body.user_email;
      }
  
      if (req.body.user_password) {
        const salt = await bcrypt.genSalt(10);
        updateFields.user_password = await bcrypt.hash(req.body.user_password.toString(), salt);
      }
      
      
      if (req.body.user_mobile_number) {
        updateFields.user_mobile_number = req.body.user_mobile_number
      }
  
      const updatedUser = await User.findByIdAndUpdate(req.params.id, updateFields, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }
  
      res.status(200).json({
        message: "Your Profile Updated Successfully",
        user: updatedUser,
      });
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
    // როცა იუზერი წაშლის თავის ექაუნთს მაგის პოსტებიც წაიშლება ავტომატურად
    await Post.deleteMany({ user_email: user.user_email });
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
