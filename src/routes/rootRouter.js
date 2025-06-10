const express = require("express");
let router = express.Router();

let rootController = require("../controller/rootController");

router.get("/about", rootController.AboutPage);

<<<<<<< HEAD
router.get("/", rootController.HomePage);

router.get("/contact", rootController.ContactPage);

module.exports = router;

=======
//home == /

//contact /contact

// 

module.exports = router;
>>>>>>> origin/master
