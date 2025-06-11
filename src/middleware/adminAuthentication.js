//adminAuthentication.js

function isAdminAuthenticated(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect("/admin/login?error=Please+login+first");
  }
}

module.exports = isAdminAuthenticated;
