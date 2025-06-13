const express = require("express");
let router = express.Router();

let userController = require("../controller/userController");

router.get("/login", userController.LoginPage);

router.post("/login", userController.UserLogin);

//logout
router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Internal Server Error");
    }
    res.redirect("/login");
  });
});


module.exports = router;
