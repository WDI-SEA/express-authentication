module.exports = (req, res, next) => {
  if (!req.user) {
    req.flash('error', 'You must be logged in to access that page');
    req.session.save(() => {
      res.redirect('/auth/login');
    });
  } else {
    next();
  }
};