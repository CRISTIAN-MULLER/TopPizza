//const user = require('../../app/models/user');
//let searchUserBtn = document.querySelector('#searchUserBtn');
const userToSearch = document.getElementById('searchUserName');
const phoneToSearch = document.getElementById('searchUserPhone');
const userTableBody = document.querySelector('#userTableBody');
const editUserBtn = document.querySelectorAll('#editUser');

$('#searchUserBtn').on('click', function (event) {
  event.preventDefault();
  if (phoneToSearch.value) {
    $.get(
      `/searchClientByPhone/${phoneToSearch.value}`,
      function (clients, res) {
        if (clients.length > 0) {
          let markup;
          markup = generateMarkup(clients);
          userTableBody.innerHTML = markup;
        } else {
          userTableBody.innerHTML = `
       <tr>
        <td ">
          <p>Cliente não encontrado.</p>
        </td>
       </tr>`;
        }
      }
    );
    return;
  } else {
    $.get(`/searchClientByName/${userToSearch.value}`, function (clients) {
      if (clients.length > 0) {
        let markup;
        markup = generateMarkup(clients);
        userTableBody.innerHTML = markup;
      } else {
        userTableBody.innerHTML = `
       <tr>
        <td">
          <p>Cliente não encontrado.</p>
        </td>
       </tr>`;
      }
    });
  }

  function generateMarkup(clients) {
    return clients
      .map((client) => {
        return `
                 <tr>
              <td class ="id" style="display: none">${client._id}</td>
              <td class ="name">${client.username}</td>
              <td ">${client.address.street},
              ${client.address.houseNumber}, 
              ${client.address.district}</td>
              <td ">${client.phone}</td>
              <td ">
              <button  type="button">
              <i id="editUser" name="editUser" class="modal-open editUser fas fa-pencil-alt"></i>
              </button>  
              </td>             
              </tr>
              `;
      })
      .join('');
  }
});

$('#userTableBody').on('click', 'tr', function (event) {
  $(this).addClass('selected').siblings().removeClass('selected');
});

function getRow() {
  // here you need to return the value
  // to be available when function was called
  return $('tr.selected > .id');
}

if (userTableBody) {
  userTableBody.addEventListener('click', function (e) {
    e.preventDefault();

    // e.target is the clicked element!
    // If it was a list item
    if (e.target && e.target.matches('.editUser')) {
      toggleModal();
      var selrowid = getRow().text();
      $.get(`/searchClientById/${selrowid}`, function (client) {
        $('#id').val(client._id);
        $('#username').val(client.username);
        $('#phone').val(client.phone);
        $('#zipcode').val(client.address.zipcode);
        $('#street').val(client.address.street);
        $('#houseNumber').val(client.address.houseNumber);
        $('#district').val(client.address.district);
        $('#city').val(client.address.city);
        $('#state').val(client.address.state);
        $('#reference').val(client.address.reference);
      });
    }
  });
}
