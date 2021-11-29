const productToSearch = document.getElementById('searchProductName');
const productTableBody = document.querySelector('#productTableBody');
const editProductBtn = document.querySelectorAll('#editProduct');

$('#searchProductBtn').on('click', function (event) {
  event.preventDefault();
  let productsToSearch = productToSearch.value;
  if (productsToSearch == '') {
    productsToSearch = 'all';
  }

  $.get(`/searchProductByName/${productsToSearch}`, function (products) {
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
    return;
  });

  function generateMarkup(products) {
    return products
      .map((product) => {
        return `
          <tr>
            <td class="id" style="display: none">${product._id}</td>
            <td class="productData">
              <img class="h-12 mx-auto" src="${product.image}" alt="" />
            </td>
            <td class="productData">
              <h2 class="text-lg">${product.name}</h2>
            </td>
            <td class="productData">
              ${Object.keys(product.saleUnits)
                .map(
                  (key) =>
                    `<div class="flex justify-between">
                          <button type="button" class="size px-4 mx-4 rounded-full text-xs">
                          ${product.saleUnits[key].saleUnit}
                          </button>
                          <span class="text-md">${product.saleUnits[
                            key
                          ].price.toLocaleString('pt-BR', {
                            style: 'currency',
                            currency: 'BRL',
                          })}</span>
                          <label class="switch-small">
                            <input type="checkbox"  ${
                              product.saleUnits[key].active === true
                                ? 'checked'
                                : ''
                            }/>
                            <span class="slider-small round-small"></span>
                          </label> 
                      </div>`
                )
                .join('')}
            </td>
            <td class="productData">
              <span class="text-lg">${product.category}</span>
            </td>

            <td>
              <button type="button">
                <i
                  id="editProduct"
                  name="editProduct"
                  class="editProduct fas fa-edit"
                ></i>
              </button>
            </td>
          </tr>`;
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
      toggleProductModal();
      var selrowid = getRow().text();

      $.get(`/searchProductById/${selrowid}`, function (product) {
        $('#id').val(product._id);
        $('#name').val(product.name);

        if (product.active == true) {
          $('#productActive').val(1);
          $('#productActiveBtn').prop('checked', true);
        } else {
          $('#productActive').val(0);
          $('#productActiveBtn').prop('checked', false);
        }

        $('#image').attr('src', product.image);
        $('#imageName').val(product.image);
        $('#category').val(product.category);
        var table = $('#productSaleUnits');
        // $('#productSaleUnits td.productSaleUnit').remove();

        product.saleUnits.forEach(function (saleUnit) {
          if (saleUnit.active) {
            table.append(
              '<tr><td class="productSaleUnit"><input type="text" name="saleUnit[]" class="border saleUnit pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.saleUnit +
                '"></input></td><td class="productSaleUnit"><input type="text" name="price[]" class="price border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }) +
                '"></input></td><td class="productSaleUnit"><input type="text" name="description[]"class="border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.description +
                '"></input></td><td class="productSaleUnit"><label class="switch mb-auto mt-auto"><input type="hidden" name="active" value="1">' +
                '<input type="checkbox" checked/><span class="slider round"></span></label></td>' +
                '<td class="productSaleUnit"><button type="button"><i name="deleteSaleUnit" class="deleteSaleUnit fas fa-trash-alt"></i></button></td></tr>'
            );
          } else {
            table.append(
              '<tr><td class="productSaleUnit"><input type="text" name="saleUnit[]" class="saleUnit border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.saleUnit +
                '"></input></td><td class="productSaleUnit"><input type="text" name="price[]" class="price border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.price.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                }) +
                '"></input></td><td class="productSaleUnit"><input type="text" name="description[]" class="border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
                saleUnit.description +
                '"></input></td><td class="productSaleUnit "><label class="switch mb-auto mt-auto"><input type="hidden" name="active" value="0">' +
                '<input type="checkbox"/><span class="slider round"></span></label></td>' +
                '<td class="productSaleUnit"><button type="button"><i name="deleteSaleUnit" class="deleteSaleUnit fas fa-trash-alt"></i></button></td></tr>'
            );
          }
        });
        $('input[type=checkbox]').each(function () {
          $(this).on('click', function () {
            let ativo = Number($(this).prev().val());
            $(this)
              .prev()
              .val(1 - ativo);
          });
        });
        $('.deleteSaleUnit').each(function () {
          $(this).on('click', function () {
            $(this).closest('tr').remove();
            alert('Delete');
          });
        });
      });
    }
  });
}
