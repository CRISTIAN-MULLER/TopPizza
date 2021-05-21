const User = require('../../../models/user');

function userController() {
  return {
    index(req, res) {
      User.find()
        .populate('customerId', '-password')
        .exec((err, clients) => {
          if (req.xhr) {
            return res.json(clients);
          } else {
            return res.render('admin/clients');
          }
        });
    },
    async addClient(req, res) {
      const userData = req.body;

      // Validate request
      // if (!name || !email || !password) {
      //   req.flash('error', 'Todos os campos são obrigatórios');
      //   req.flash('name', name);
      //   req.flash('email', email);
      //   return res.redirect('/register');
      // }

      // Check if email exists
      // Users.exists({ email: email }, (err, result) => {
      //   if (result) {
      //     req.flash('error', 'Este email já está cadastrado');
      //     req.flash('name', name);
      //     req.flash('email', email);
      //     return res.redirect('/register');
      //   }
      // });

      // Create a user
      const user = new User({
        name: userData.username,
        phone: userData.phone,
        address: {
          zipcode: userData.zipcode,
          street: userData.street,
          houseNumber: userData.houseNumber,
          district: userData.district,
          city: userData.city,
          state: userData.state,
          reference: userData.reference,
        },
      });

      user
        .save()
        .then((user) => {
          return res.redirect('clients');
        })
        .catch((err) => {
          console.log(err);
          req.flash('error', 'Algo deu errado, tente novamente');
          return res.redirect('clients');
        });
    },

    handleUser(req, res) {
      User.find()
        .populate('customerId', '-password')
        .exec((err, clients) => {
          if (req.xhr) {
            return res.json(clients);
          } else {
            return res.render('admin/clientForm');
          }
        });
    },
  };
}

module.exports = userController;
