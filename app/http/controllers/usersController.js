const User = require('../../models/user');

function usersController() {
  return {
    async searchClientById(req, res) {
      const idToSearch = req.params.clientid;

      User.findById(idToSearch)
        .select('-password')

        .then((client) => {
          res.send(client);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'usuário não encontrado.' });
        });
    },

    async searchClientByName(req, res) {
      const userToSearch = req.params.clientname;

      User.find({ username: { $regex: new RegExp(userToSearch, 'i') } })
        .select('-password')
        .then((client) => {
          res.send(client);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'usuário não encontrado.' });
        });
    },

    async searchClientByPhone(req, res) {
      const phoneToSearch = req.params.phone;
      User.find({ phone: { $regex: new RegExp(phoneToSearch, 'i') } })
        .then((client) => {
          res.send(client);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'usuário não encontrado.' });
        });
    },
  };
}

module.exports = usersController;
