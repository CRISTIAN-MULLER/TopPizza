const orderForm = document.getElementById('orderForm');
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
const hiddenPaymentMethod = document.getElementById('paymentMethodValue');

orderForm.addEventListener('submit', (e) => {
  e.preventDefault();
  checkInputs();
});

function checkInputs() {
  // trim to remove the whitespaces
  const usernameValue = username.value.trim();
  const phoneValue = phone.value.trim();
  const zipcodeValue = zipcode.value.trim();
  const streetValue = street.value.trim();
  const houseNumberValue = houseNumber.value.trim();
  const districtValue = district.value.trim();
  const cityValue = city.value.trim();
  const stateValue = state.value.trim();
  const referenceValue = reference.value.trim();
  if (entryPoint === null || entryPoint === undefined) {
    const entryPointValue = 'Site';
    hiddenEntryPoint.value = entryPointValue;
  } else {
    hiddenEntryPoint.value = entryPoint.value;
  }
  const paymentMethodValue = paymentMethod.value;

  hiddenPaymentMethod.value = paymentMethodValue;

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
    document.orderForm.submit();
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
