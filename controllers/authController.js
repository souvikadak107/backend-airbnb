

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    editing: false,
    isLoggedIn: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  console.log(req.body);
  //res.cookie("isLoggedIn", true);
  //req.isLoggedIn = true;

  req.session.isLoggedIn=true;
  res.redirect("/");
};

exports.postLogout= (req, res, next)=>{
  req.session.destroy(()=>{
    res.redirect("/");
  })
}



