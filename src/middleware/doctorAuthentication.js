function isDoctorAuthenticated(req, res, next) {
  if (req.session.user && req.session.user.role === "doctor") {
    next();
  } else {
    res.redirect("/login?error=Please+login+as+Doctor+first");
  }
}
module.exports = isDoctorAuthenticated;
