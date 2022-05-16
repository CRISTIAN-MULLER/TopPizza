let searchzipcodebtn = document.querySelector('#searchzipcodebtn')
const zipcodeToSearch = document.querySelector('#zipcode')
let streetToSearch = document.querySelector('#street')
let districtToSearch = document.querySelector('#district')
let cityToSearch = document.querySelector('#city')
let stateToSearch = document.querySelector('#state')

if (searchzipcodebtn !== null) {
	searchzipcodebtn.addEventListener('click', function (e) {
		let zipcodeToSearchValue = zipcodeToSearch.value
		let script = document.createElement('script')

		script.src =
			'https://viacep.com.br/ws/' +
			zipcodeToSearchValue +
			'/json/?callback=searchZipcode'
		document.body.appendChild(script)
	})
}

function searchZipcode(res) {
	if ('erro' in res) {
		alert('Cep não encontrado.')
		return
	}

	console.log('endereço', res)

	street.value = res.logradouro
	district.value = res.bairro
	city.value = res.localidade
	state.value = res.uf
}
