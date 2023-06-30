const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      profilePic: req.body.profilePic,
    });
    const user = await newUser.save();

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      res.status(400).json("username or password is wrong!, wrong credentials");
      return;
    }

    const validate = await bcrypt.compare(req.body.password, user.password);

    if (!validate) {
      res.status(400).json("username or password is wrong!, wrong credentials");
      return;
    }

    const { password, ...others } = user._doc;

    if (user && validate) {
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.TOKEN_SECRET_KEY
      );

      res.status(200).json({ token, ...others });
      return;
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
