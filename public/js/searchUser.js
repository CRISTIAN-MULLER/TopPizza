//const user = require('../../app/models/user');
//let searchUserBtn = document.querySelector('#searchUserBtn');
const userToSearch = document.getElementById('searchUserName')
const phoneToSearch = document.getElementById('searchUserPhone')
const userTableBody = document.querySelector('#userTableBody')
const editUserBtn = document.querySelectorAll('#editUser')

$('#searchUserBtn').on('click', function (event) {
	event.preventDefault()
	const filter = {}
	if (phoneToSearch.value) {
		filter.phone = phoneToSearch.value
	}
	if (userToSearch.value) {
		filter.firstName = userToSearch.value
	}

	console.log(JSON.stringify(filter))

	$.get(
		`/searchClient/${JSON.stringify(filter)}`,

		function (clients, res) {
			if (clients.length > 0) {
				let markup
				markup = generateMarkup(clients)
				userTableBody.innerHTML = markup
			} else {
				userTableBody.innerHTML = `
		 <tr>
		  <td ">
		    <p>Cliente não encontrado.</p>
		  </td>
		 </tr>`
			}
		},
	)
	return

	function generateMarkup(clients) {
		return clients
			.map((client) => {
				let clientId = client._id
				let clientUserName = `${client.firstName} ${client.lastName}`
				let clientAddressStreet = ''
				let clientAddressHouseNumber = ''
				let clientAddressDistrict = ''

				if (client.addresses?.length) {
					const favoriteAddress = client.addresses.find(
						(address) => address.isFavorite === true,
					)
					clientAddressStreet = favoriteAddress.street
					clientAddressHouseNumber = favoriteAddress.houseNumber
					clientAddressDistrict = favoriteAddress.district
				}

				let clientPhone = client.phone == undefined ? '' : client.phone

				return `
                 <tr>
              <td class ="id" style="display: none">${clientId}</td>
              <td class ="name">${clientUserName}</td>
              <td ">${clientAddressStreet} ,
              ${clientAddressHouseNumber} , 
              ${clientAddressDistrict}</td>
              <td ">${clientPhone}</td>
              <td ">
              <button  type="button">
              <i id="editUser" name="editUser" class="modal-client-open editUser fas fa-pencil-alt"></i>
              </button>  
              </td>             
              </tr>
              `
			})
			.join('')
	}
})

$('#userTableBody').on('click', 'tr', function (event) {
	$(this).addClass('selected').siblings().removeClass('selected')
})

function getRow() {
	// here you need to return the value
	// to be available when function was called
	return $('tr.selected > .id')
}

if (userTableBody) {
	userTableBody.addEventListener('click', function (e) {
		e.preventDefault()

		// e.target is the clicked element!
		// If it was a list item
		if (e.target && e.target.matches('.editUser')) {
			toggleClientModal()
			$('.form-control').removeClass('success error')
			$('small').text('')
			$('.small-message').text('')
			const userId = {
				_id: getRow().text(),
			}

			$.get(`/searchClient/${JSON.stringify(userId)}`, function (user) {
				const [client] = user
				console.log(client)

				let favoriteAddress

				if (client.addresses?.length) {
					favoriteAddress = client.addresses.find(
						(address) => address.isFavorite === true,
					)
				}

				console.log(favoriteAddress)

				$('#id').val(client._id)
				$('#firstName').val(client.firstName)
				$('#lastName').val(client.lastName)
				$('#phone').val(client.phone)
				$('#zipcode').val(favoriteAddress.zipcode)
				$('#street').val(favoriteAddress.street)
				$('#houseNumber').val(favoriteAddress.houseNumber)
				$('#district').val(favoriteAddress.district)
				$('#city').val(favoriteAddress.city)
				$('#state').val(favoriteAddress.state)
				$('#reference').val(favoriteAddress.reference)
			})
		}
	})
}
