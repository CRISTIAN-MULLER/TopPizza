let searchzipcodebtn = document.querySelector('#searchzipcodebtn');
const zipcodeToSearch = document.querySelector('#zipcode');
let streetToSearch = document.querySelector('#street');
let districtToSearch = document.querySelector('#district');
let cityToSearch = document.querySelector('#city');
let stateToSearch = document.querySelector('#state');

//zipcode.value = '01001000';
searchzipcodebtn.addEventListener('click', function(e) {
  console.log(zipcodeToSearch.value);
  let zipcodeToSearchValue = zipcodeToSearch.value;
  let script = document.createElement('script');

  script.src =
    'https://viacep.com.br/ws/' +
    zipcodeToSearchValue +
    '/json/?callback=searchZipcode';
  document.body.appendChild(script);
});

function searchZipcode(res) {
  if ('erro' in res) {
    alert('Cep não encontrado.');
    return;
  }

  street.value = res.logradouro;
  district.value = res.bairro;
  city.value = res.localidade;
  state.value = res.uf;
}