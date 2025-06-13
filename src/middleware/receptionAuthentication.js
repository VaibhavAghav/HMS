function isReceptionAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.role === "receptionist") {
    next();
  } else {
    res.redirect("/login?error=Please+login+as+Receptionist+first");
  }
}
module.exports = isReceptionAuthenticated;
