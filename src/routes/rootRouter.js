const express = require("express");
let router = express.Router();

let rootController = require("../controller/rootController");

router.get("/about", rootController.AboutPage);

router.get("/", rootController.HomePage);

router.get("/contact", rootController.ContactPage);

module.exports = router;

