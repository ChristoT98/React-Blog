const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/users');
const PostRoute = require('./routes/posts');
const CategoryRoute = require('./routes/categories');

const multer = require("multer");
const path = require("path");

dotenv.config();
app.use(express.json());
app.use(cors());
app.use("/images", express.static(path.join(__dirname, "/images")));

const PORT = process.env.PORT || 5000;
const URL = process.env.MONGODB_URL;

mongoose.connect(URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
}).then(console.log("Conneted to MongoDB Successfully!!"))
    .catch((err => console.log(err)));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "images");
    },
    filename: (req, file, cb) => {
        cb(null, req.body.name);
    },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
    res.status(200).json("File has been uploaded");
});


app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", PostRoute);
app.use("/api/categories", CategoryRoute);

app.listen(PORT, () => {
    console.log(`Server is up and running on port number: ${PORT}`);
});