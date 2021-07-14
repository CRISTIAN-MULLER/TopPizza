const Users = require('../../models/user');

function usersController() {
  return {
    async searchClientById(req, res) {
      const idToSearch = req.params.clientid;

      Users.findById(idToSearch)
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
      Users.find({ name: { $regex: new RegExp(userToSearch, 'i') } })
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
      Users.find({ phone: { $regex: new RegExp(phoneToSearch, 'i') } })
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
