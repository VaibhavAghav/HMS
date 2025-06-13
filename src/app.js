//app.js

const express = require("express");
const bodyParser = require("body-parser");

const router = require("./routes/userRouter"); // correct route file
const rootRouter = require("./routes/rootRouter");

const adminRouter = require("./routes/adminRouter");

// declare/ required medicine
const medicineRouter = require("./routes/medicineRouter");

const doctorRouter = require("./routes/doctorRouter");

const receptionistRouter = require("./routes/receptionRouter");

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

app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 30,
    },
  })
);

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

// Use routes
app.use("/", router);
app.use("/", rootRouter);
app.use("/admin", adminRouter);

app.use("/medicine", medicineRouter);

app.use("/receptionist", receptionistRouter);

app.use("/doctor", doctorRouter);

// router for medicine

module.exports = app;
