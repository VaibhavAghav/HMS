const express = require("express");
let router = express.Router();

let userController = require("../controller/userController");

router.get("/login", userController.LoginPage);

router.post("/login", userController.UserLogin);

module.exports = router;
