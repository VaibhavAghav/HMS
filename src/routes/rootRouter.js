const express = require("express");
let router = express.Router();

let rootController = require("../controller/rootController");

router.get("/about", rootController.AboutPage);

//home == /

//contact /contact

// 

module.exports = router;
