const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');
function authController() {
  const _getRedirectUrl = (req) => {
    return req.user.role === 'admin' ? '/admin/orders' : '/';
  };

  return {
    login(req, res) {
      res.render('auth/login');
    },
    postLogin(req, res, next) {
      const { email, password } = req.body;
      console.log(req.body);
      // Validate request
      if (!email || !password) {
        req.flash('error', 'Todos os campos são obrigatórios');
        return res.redirect('/login');
      }
      passport.authenticate('local', (err, user, info) => {
        if (err) {
          req.flash('error', info.message);
          return next(err);
        }
        if (!user) {
          req.flash('error', info.message);
          return res.redirect('/login');
        }
        req.logIn(user, (err) => {
          if (err) {
            req.flash('error', info.message);
            return next(err);
          }

          return res.redirect(_getRedirectUrl(req));
        });
      })(req, res, next);
    },
    register(req, res) {
      res.render('auth/register');
    },
    async postRegister(req, res) {
      const { username, email, password } = req.body;

      // Validate request
      if (!username || !email || !password) {
        req.flash('error', 'Todos os campos são obrigatórios');
        req.flash('username', username);
        req.flash('email', email);
        return res.redirect('/register');
      }

      // Check if email exists
      User.exists({ email: email }, (err, result) => {
        if (result) {
          req.flash('error', 'Este email já está cadastrado');
          req.flash('username', username);
          req.flash('email', email);
          return res.redirect('/register');
        }
      });

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      // Create a user
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      user
        .save()
        .then((user) => {
          // Login
          return res.redirect('/');
        })
        .catch((err) => {
          req.flash('error', 'Algo deu errado, tente novamente');
          return res.redirect('/register');
        });
    },
    logout(req, res) {
      delete req.session.cart;
      req.logout();
      return res.redirect('/login');
    },
  };
}

module.exports = authController;
