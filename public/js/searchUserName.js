//const user = require('../../app/models/user');
let searchUserBtn = document.querySelector('#searchUserBtn');
const userToSearch = document.querySelector('#searchusername');
const phoneToSearch = document.querySelector('#searchuserphone');

searchUserBtn.addEventListener('click', function(res) {
  console.log(userToSearch.value, phoneToSearch.value);
  return res.render('/usersearch/', { username });
});

function findUserByName(req, res) {
  //const usernameValue = user.find({ username: req.username });
  req.render('/usersearch/' + userToSearch);
}
