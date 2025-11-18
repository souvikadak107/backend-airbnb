

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    pageTitle: "Login",
    currentPage: "login",
    editing: false,
    isLoggedIn: req.isLoggedIn
  });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  req.session.save(err => {
    if (err) {
      console.log('Session save error:', err);
    }
    res.redirect("/");
  });
};


exports.postLogout= (req, res, next)=>{
  req.session.destroy(()=>{
    res.redirect("/");
  })
}



