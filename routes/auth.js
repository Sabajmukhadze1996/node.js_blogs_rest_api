const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    if (!req.body.username || !req.body.email || !req.body.password) {
      res.status(401).json("Missing username, email, or password!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.email)) {
      res.status(405).json("Please write a correct email!");
      return;
    }

    if (req.body.username.length < 3 || req.body.username.length > 45) {
      res.status(405).json("Username must be 3 to 45 characters long.");
      return;
    }

    if (req.body.password.length < 8 || req.body.password.length > 45) {
      res.status(405).json("Password must be 8 to 45 characters long.");
      return;
    }

    const existingUser = await User.findOne({ email: req.body.email });

    if (existingUser) {
      res.status(409).json("A user with this email already exists!");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePic: req.body.profilePic,
    });
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res
        .status(400)
        .json("Username or password is wrong! Invalid credentials.");
      return;
    }

    const validate = await bcrypt.compare(req.body.password, user.password);

    if (!validate) {
      res
        .status(400)
        .json("Username or password is wrong! Invalid credentials.");
      return;
    }

    const { password, ...otherUserInfos } = user._doc;

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.TOKEN_SECRET_KEY
    );

    res.status(200).json({ token, ...otherUserInfos });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
