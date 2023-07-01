const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    if (
      !req.body.user_name ||
      !req.body.user_email ||
      !req.body.user_password ||
      !req.body.user_mobile_number
    ) {
      res.status(401).json("Missing username, email, mobile number, location or password!");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(req.body.user_email)) {
      res.status(405).json("Please write a correct email!");
      return;
    }

    if (req.body.user_email.length > 90) {
      res.status(405).json("Email address is too long. Please provide a shorter email.");
      return;
    }

    if (req.body.user_name.length < 3 || req.body.user_name.length > 45) {
      res.status(405).json("Username must be 3 to 45 characters long.");
      return;
    }

    if (req.body.user_password.length < 8 || req.body.user_password.length > 45) {
      res.status(405).json("Password must be 8 to 45 characters long.");
      return;
    }

    if (req.body.user_mobile_number.length > 60) {
      res.status(405).json("User mobile number cannot exceed 60 characters.");
      return;
    }

    const existingUser = await User.findOne({ user_email: req.body.user_email });

    if (existingUser) {
      res.status(409).json("A user with this email already exists!");
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.user_password.toString(), salt)

    const newUser = new User({
      user_name: req.body.user_name.toString(),
      user_email: req.body.user_email.toString(),
      user_mobile_number: req.body.user_mobile_number.toString(),
      user_password: hashedPassword,
    });

    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ user_email: req.body.user_email });

    if (!user) {
      res.status(400).json("Username or password is wrong! Invalid credentials.");
      return;
    }

    const validate = await bcrypt.compare(
      req.body.user_password.toString(),
      user.user_password
    );

    if (!validate) {
      res.status(400).json("Username or password is wrong! Invalid credentials.");
      return;
    }

    const { user_password, ...otherUserInfos } = user._doc;

    const token = jwt.sign(
      { userId: user._id, email: user.user_email },
      process.env.TOKEN_SECRET_KEY
    );

    res.status(200).json({ token, ...otherUserInfos });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
