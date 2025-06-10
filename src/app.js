const express = require("express");
const bodyParser = require("body-parser");
const router = require("./routes/userRouter"); // correct route file
const rootRouter = require("./routes/rootRouter");
const adminRouter = require("./routes/adminRouter");
let path = require("path");
// express static

const app = express();

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, "public")));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

const session = require("express-session");
const { count } = require("console");

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Use routes
app.use("/", router);
app.use("/", rootRouter);
app.use("/admin", adminRouter);

module.exports = app;