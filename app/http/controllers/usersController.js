const Users = require('../../models/user');
function usersController() {
  return {
    async searchUser(req, res) {
      const userToSearch = req.params.username;
      const user = await Users.find({
        name: { $regex: new RegExp(userToSearch, 'i') },
      });
      return user;
      console.log(user);
    },
  };
}

module.exports = usersController;
