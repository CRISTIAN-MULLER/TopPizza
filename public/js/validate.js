const orderForm = document.getElementById('orderForm');
const handleClientForm = document.getElementById('handleClientForm');
const username = document.getElementById('username');
const phone = document.getElementById('phone');
const zipcode = document.getElementById('zipcode');
const street = document.getElementById('street');
const houseNumber = document.getElementById('houseNumber');
const district = document.getElementById('district');
const city = document.getElementById('city');
const state = document.getElementById('state');
const reference = document.getElementById('reference');
const entryPoint = document.getElementById('entryPoint');
const hiddenEntryPoint = document.getElementById('entryPointValue');
const paymentMethod = document.getElementById('paymentMethod');
const observation = document.getElementById('observation');

if (orderForm !== null) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (checkInputs()) {
      if (entryPoint === null || entryPoint === undefined) {
        const entryPointValue = 'Site';
        hiddenEntryPoint.value = entryPointValue;
      } else {
        hiddenEntryPoint.value = entryPoint.value;
      }

      document.orderForm.submit();
    }
  });
}

// if (handleClientForm !== null) {
//   handleClientForm.addEventListener('submit', (e) => {
//     e.preventDefault();
//     if (checkInputs()) {
//       document.handleClientForm.submit();
//     }
//   });
// }

$('#handleClientForm').on('submit', function (event) {
  event.preventDefault();
  if (checkInputs()) {
    $.ajax({
      url: '/admin/clients/handleUser',
      data: $('#handleClientForm').serialize(),
      method: 'POST',
    });
    $('#small-message').html('Dados Salvos com sucesso');
  }
});

$('#handleProductForm').on('submit', function (event) {
  event.preventDefault();
  var form = $('#handleProductForm')[0];
  var data = new FormData(form);
  $.ajax({
    url: '/admin/products/handleProduct',
    enctype: 'multipart/form-data',
    processData: false,
    contentType: false,
    data: data,
    method: 'POST',
  });
});

$('#addSaleUnitBtn').on('click', function (event) {
  event.preventDefault();
  var table = $('#productSaleUnits');
  let saleUnit = $(this).closest('tr').find('.saleUnit').val();
  let price = parseFloat(
    $(this).closest('tr').find('.price').val().replace(/,/, '.')
  );
  let description = $(this).closest('tr').find('.description').val();

  table.append(
    '<tr><td class="productSaleUnit"><input type="text" name="saleUnit[]" class="border saleUnit pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
      saleUnit +
      '"></input></td><td class="productSaleUnit"><input type="text" name="price[]" class="price border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
      price.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }) +
      '"></input></td><td class="productSaleUnit"><input type="text" name="description[]"class="border pl-6 mr-4 px-4 py-2 border-gray-400 rounded-md" value="' +
      description +
      '"></input></td><td class="productSaleUnit"><label class="switch mb-auto mt-auto"><input type="hidden" name="active" value="1">' +
      '<input type="checkbox" checked/><span class="slider round"></span></label></td>' +
      '<td class="productSaleUnit"><button type="button"><i name="deleteSaleUnit" class="deleteSaleUnit fas fa-trash-alt"></i></button></td></tr>'
  );
});

function checkInputs() {
  // trim para remover espaços em branco
  const usernameValue = username.value.trim();
  const phoneValue = phone.value.trim();
  const zipcodeValue = zipcode.value.trim();
  const streetValue = street.value.trim();
  const houseNumberValue = houseNumber.value.trim();
  const districtValue = district.value.trim();
  const cityValue = city.value.trim();
  const stateValue = state.value.trim();
  const referenceValue = reference.value.trim();

  if (usernameValue === '') {
    setErrorFor(username, 'Nome não pode ficar em branco.');
  } else {
    setSuccessFor(username);
  }

  if (phoneValue === '') {
    setErrorFor(phone, 'Telefone Não pode ficar em branco.');
  } else {
    setSuccessFor(phone);
  }

  if (zipcodeValue === '') {
    setErrorFor(zipcode, 'Cep Não pode ficar em branco.');
  } else {
    setSuccessFor(zipcode);
  }

  if (streetValue === '') {
    setErrorFor(street, 'Rua não pode ficar em branco.');
  } else {
    setSuccessFor(street);
  }

  if (houseNumberValue === '') {
    setErrorFor(houseNumber, 'Número não pode ficar em branco.');
  } else {
    setSuccessFor(houseNumber);
  }
  if (districtValue === '') {
    setErrorFor(district, 'Bairro não pode ficar em branco.');
  } else {
    setSuccessFor(district);
  }
  if (cityValue === '') {
    setErrorFor(city, 'Cidade não pode ficar em branco.');
  } else {
    setSuccessFor(city);
  }
  if (stateValue === '') {
    setErrorFor(state, 'Estado não pode ficar em branco.');
  } else {
    setSuccessFor(state);
  }
  if (referenceValue === '') {
    setErrorFor(reference, 'Ponto de referência não pode ficar em branco.');
  } else {
    setSuccessFor(reference);
  }
  if (
    usernameValue !== '' &&
    phoneValue !== '' &&
    zipcodeValue !== '' &&
    streetValue !== '' &&
    houseNumberValue !== '' &&
    districtValue !== '' &&
    cityValue !== '' &&
    stateValue !== '' &&
    referenceValue !== ''
  ) {
    return true;
  }
}

function setErrorFor(input, message) {
  const formControl = input.parentElement;

  const small = formControl.querySelector('small');
  formControl.className = 'form-control error';
  small.innerText = message;
}

function setSuccessFor(input) {
  const formControl = input.parentElement;
  formControl.className = 'form-control success';
}

function isEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

// // SOCIAL PANEL JS
// const floating_btn = document.querySelector('.floating-btn');
// const close_btn = document.querySelector('.close-btn');
// const social_panel_container = document.querySelector(
//   '.social-panel-container'
// );

// floating_btn.addEventListener('click', () => {
//   social_panel_container.classList.toggle('visible');
// });

// close_btn.addEventListener('click', () => {
//   social_panel_container.classList.remove('visible');
// });
