exports.LoginPage = (req, res) => {
  console.log("Inside controller ");
  res.render("userLogin");
};


exports.UserLogin = (req, res) => {
  console.log("Inside controller ");
  console.log(req.body);

  const { username, password, role } = req.body;

  if (!username || !password || !role) {
    return res.status(400).send("Username, password, and role are required");
  }

  if (username === "admin" && password === "admin" && role === "admin") {
    console.log("Login successful admin");
    req.session.admin = {
      user_id: 1,
      username: "admin",
      role: "admin",
    };
    return res.redirect("/admin");
  } else if (role === "doctor") {
    console.log("Login successful doctor");
    req.session.user = { username, role };
    return res.redirect("/doctor");
  } else if (role === "receptionist") {
    console.log("Login successful receptionist");
    req.session.user = { username, role };
    return res.redirect("/receptionist");
  } else {
    return res.status(400).send("Invalid credentials or role");
  }
};
