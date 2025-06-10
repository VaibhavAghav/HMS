const express = require("express");
let router = express.Router();

let userController = require("../controller/userController");
<<<<<<< HEAD

router.get("/login", userController.LoginPage);
=======
>>>>>>> origin/master

router.get("/login", userController.LoginPage);
module.exports = router;
