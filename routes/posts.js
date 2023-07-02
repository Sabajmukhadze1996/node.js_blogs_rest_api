const router = require("express").Router();
const multer = require("multer");
const Post = require("../models/Post");
const User = require("../models/User")

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/:userId", upload.single("item_image"), async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json("User not found");
    }

    const {
      item_title,
      item_description,
      item_location,
      user_name,
      user_email,
      user_mobile_number,
    } = req.body;

    if (!item_title || !item_description || !item_location || !user_name || !user_email || !user_mobile_number) {
      return res.status(401).json("Missing item_title, item_description, item_location, user_name, user_email, or user_mobile_number!");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(user_email)) {
      return res.status(405).json("Please write a correct email!");
    }

    if (user_email.length > 90) {
      return res.status(405).json("Email address is too long. Please provide a shorter email.");
    }

    if (user_name.length < 3 || user_name.length > 45) {
      return res.status(405).json("Username must be 3 to 45 characters long.");
    }

    if (user_mobile_number.length > 60) {
      return res.status(405).json("User mobile number cannot exceed 60 characters.");
    }

    let item_image = {};

    if (req.file) {
      item_image.data = req.file.buffer;
      item_image.contentType = req.file.mimetype;
    }

    const newPost = new Post({
      item_title,
      item_description,
      item_location,
      item_image,
      user_name,
      user_email,
      user_mobile_number,
    });

    const savedPost = await newPost.save();

    const base64Image = item_image.data ? item_image.data.toString("base64") : "";

    res.status(200).json({
      ...savedPost._doc,
      item_image: {
        data: base64Image,
        contentType: item_image.contentType,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});




router.put("/:postId", upload.single("item_image"), async (req, res) => {
  const postId = req.params.postId;

  try {
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json("Post not found");
    }

    const {
      item_title,
      item_description,
      item_location,
      user_name,
      user_email,
      user_mobile_number,
    } = req.body;

    const updatedPost = {
      item_title: item_title || existingPost.item_title,
      item_description: item_description || existingPost.item_description,
      item_location: item_location || existingPost.item_location,
      user_name: user_name || existingPost.user_name,
      user_email: user_email || existingPost.user_email,
      user_mobile_number: user_mobile_number || existingPost.user_mobile_number,
    };

    let item_image = {};

    if (req.file) {
      item_image.data = req.file.buffer;
      item_image.contentType = req.file.mimetype;
    }

    if (item_image.data) {
      updatedPost.item_image = {
        data: item_image.data,
        contentType: item_image.contentType,
      };
    }

    if (user_email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(user_email)) {
        return res.status(405).json("Please write a correct email!");
      }
      if (user_email.length > 90) {
        return res.status(405).json("Email address is too long. Please provide a shorter email.");
      }
    }

    if (user_name) {
      if (user_name.length < 3 || user_name.length > 45) {
        return res.status(405).json("Username must be 3 to 45 characters long.");
      }
    }

    if (user_mobile_number) {
      if (user_mobile_number.length > 60) {
        return res.status(405).json("User mobile number cannot exceed 60 characters.");
      }
    }

    const updatedPostData = await Post.findByIdAndUpdate(postId, updatedPost, { new: true });

    const base64Image = item_image.data ? item_image.data.toString("base64") : "";

    res.status(200).json({
      ...updatedPostData._doc,
      item_image: {
        data: base64Image || existingPost.item_image.data.toString("base64"),
        contentType: item_image.contentType || existingPost.item_image.contentType,
      },
    });
  } catch (err) {
    res.status(500).json(err);
  }
});


module.exports = router;



// router.get("/", async (req, res) => {
//   const email = req.query.email;

//   try {
//     let posts;
//     if (email) {
//       posts = await Post.find({ email: email });
//     } else {
//       posts = await Post.find();
//     }

//     res.status(200).json(posts);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });


