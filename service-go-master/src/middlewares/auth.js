export const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  //   Show errror and redirect
  let errors = [
    {
      param: "auth"
    }
  ];
  res.render("login", {
    errors: errors
  });
};
