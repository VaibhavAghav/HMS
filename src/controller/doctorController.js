exports.AddDoctor = (req, res) => {
  console.log("Doctor page");
  res.render("addDoctor");
};

exports.SavedDoctor = (req, res) => {
  console.log(" post Doctor page");
    let {} = req.body;

  res.render("addDoctor");
};

