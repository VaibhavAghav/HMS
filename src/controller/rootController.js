exports.AboutPage = (req, res) => {
  console.log("Inside controller About ");
  res.render("about");
};

exports.HomePage =(req, res)=>{
  console.log("Inside controller Home ");
  res.render("home");
};

exports.ContactPage =(req, res) => {
  console.log("Inside controller Contact ");
  res.render("contact");
}