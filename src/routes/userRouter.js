const express = require("express");
let router = express.Router();

let userController = require("../controller/userController");

router.get("/login", userController.LoginPage);

router.get("/login", userController.LoginPage);
module.exports = router;
