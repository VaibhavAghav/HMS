//adminAuthentication.js

function isAdminAuthenticated(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/login?error=Please+login+first");
  }
}

module.exports = isAdminAuthenticated;
