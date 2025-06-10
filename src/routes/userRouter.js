const express = require("express");
let router = express.Router();

let userRouter = require("../controller/userController");

router.get("/login", userRouter.LoginPage);

module.exports = router;
