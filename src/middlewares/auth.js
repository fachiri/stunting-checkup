module.exports = {
  isLoggedIn: async (req, res, next) => {
    if (req.session.user) {
      next();
    } else {
      req.flash('error', 'Akses tidak sah');
      res.redirect(`/auth/login`)
    }
  }
}