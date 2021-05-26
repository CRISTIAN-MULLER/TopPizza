const productToSearch = document.getElementById('searchProductName');
const productTableBody = document.querySelector('#productTableBody');
const editProductBtn = document.querySelectorAll('#editProduct');

$('#searchProductBtn').on('click', function (event) {
  event.preventDefault();

  if (productToSearch.value) {
    $.get(`/searchProductByName/${productToSearch.value}`, function (products) {
      if (products.length > 0) {
        let markup;
        markup = generateMarkup(products);
        productTableBody.innerHTML = markup;
      } else {
        productTableBody.innerHTML = `
       <tr>
        <td">
          <p>Produto não encontrado.</p>
        </td>
       </tr>`;
      }
    });
    return;
  }

  function generateMarkup(products) {
    return products
      .map((product) => {
        return `
                 <tr>
              <td class ="id" style="display: none">${product._id}</td>
              <td class ="name">${product.name}</td>
              <td ">${product.category},
              <td ">${product.size}</td>
              <td ">
              <button  type="button">
              <i id="editProduct" name="editProduct" class="modal-open editProduct fas fa-pencil-alt"></i>
              </button>  
              </td>             
              </tr>
              `;
      })
      .join('');
  }
});

$('#productTableBody').on('click', 'tr', function (event) {
  $(this).addClass('selected').siblings().removeClass('selected');
});

function getRow() {
  // here you need to return the value
  // to be available when function was called
  return $('tr.selected > .id');
}

if (productTableBody) {
  productTableBody.addEventListener('click', function (e) {
    e.preventDefault();

    // e.target is the clicked element!
    // If it was a list item
    if (e.target && e.target.matches('.editProduct')) {
      toggleModal();
      var selrowid = getRow().text();
      // $.get(`/searchClientById/${selrowid}`, function (client) {
      //   $('#id').val(client._id);
      //   $('#username').val(client.username);
      //   $('#phone').val(client.phone);
      //   $('#zipcode').val(client.address.zipcode);
      //   $('#street').val(client.address.street);
      //   $('#houseNumber').val(client.address.houseNumber);
      //   $('#district').val(client.address.district);
      //   $('#city').val(client.address.city);
      //   $('#state').val(client.address.state);
      //   $('#reference').val(client.address.reference);
      // });
    }
  });
}
