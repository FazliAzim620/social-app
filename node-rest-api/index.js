const express = require("express");
const helmet = require("helmet"); //elmet. js is a useful Node. js module that helps you secure HTTP headers returned by your Express apps.
const morgan = require("morgan"); //morgan is a Node. js and Express middleware to log HTTP requests and errors, and simplifies the process.
const dotenv = require("dotenv"); //dotenv allows you to separate secrets from your source code.
const ConnectDB = require("./DB/connection");
const path=require('path')

//          routes
const userroutes = require("./routes/users");
const authroutes = require("./routes/auth");
const postsroutes = require("./routes/posts");
const multer = require("multer");

dotenv.config();
const app = express();
app.use('/images',express.static(path.join(__dirname,"public/images")))
// connect database

ConnectDB();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({storage});
// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.post("/api/upload", upload.single("file"),async(req, res) => {
  try {
    res.status(200).json("file upload successfuly");
  } catch (e) {
    console.log(e);
  }
});

app.use("/api/users", userroutes);
app.use("/api/profile/users", userroutes);
app.use("/api/auth", authroutes);
app.use("/api/posts", postsroutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
  console.log("server is listning on PORT:" + PORT);
});
