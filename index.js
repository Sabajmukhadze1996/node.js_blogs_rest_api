const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const helmet = require("helmet");
const mongoose = require("mongoose");

const authRoute = require("./routes/auth");
const usersRoute = require("./routes/users");
const postsRoute = require("./routes/posts")
const authMiddleware = require("./authMiddleWare");

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Successfully connected to MongoDB"))
  .catch((err) => console.log(err));


app.use(cors());
app.use(helmet());
app.use(express.json());



app.use("/api/auth", authRoute);
app.use("/api/users", authMiddleware, usersRoute);
app.use("/api/posts", authMiddleware, postsRoute)


app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
