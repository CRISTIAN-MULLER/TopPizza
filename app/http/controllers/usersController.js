const User = require('../../models/user')
const { GraphQLClient, gql } = require('graphql-request')

function usersController() {
	return {
		async searchClient(req, res) {
			const { filter } = req.params

			const variables = {
				data: {
					limit: 30,
				},
				filter: JSON.parse(filter) || {},
			}

			const query = gql`
				query GetAllUsers($data: PaginationInput!, $filter: UserFilter) {
					getAllUsers(data: $data, filter: $filter) {
						users {
							_id
							firstName
							lastName
							phone
							addresses {
								street
								houseNumber
								district
								city
								state
								reference
								zipcode
								isFavorite
							}
						}
					}
				}
			`

			const endpoint = 'http://192.168.100.3:4000/graphql'

			const graphQLClient = new GraphQLClient(endpoint)

			const data = await graphQLClient.request(query, variables)

			//const products = await Product.find({ active: true })

			const { users } = data.getAllUsers
			res.send(users)
			// User.find({ phone: { $regex: new RegExp(phoneToSearch, 'i') } })
			//   .then((client) => {
			//     res.send(client);
			//   })
			//   .catch((err) => {
			//     res
			//       .status(500)
			//       .send({ message: err.message || 'usuário não encontrado.' });
			//   });
		},

		async searchClientById(req, res) {
			const idToSearch = req.params.clientid

			User.findById(idToSearch)
				.select('-password')

				.then((client) => {
					res.send(client)
				})
				.catch((err) => {
					res
						.status(500)
						.send({ message: err.message || 'usuário não encontrado.' })
				})
		},

		async searchClientByName(req, res) {
			const userToSearch = req.params.clientname

			User.find({ username: { $regex: new RegExp(userToSearch, 'i') } })
				.select('-password')
				.then((client) => {
					res.send(client)
				})
				.catch((err) => {
					res
						.status(500)
						.send({ message: err.message || 'usuário não encontrado.' })
				})
		},

		async searchClientByPhone(req, res) {
			const phoneToSearch = req.params.phone

			User.find({ phone: { $regex: new RegExp(phoneToSearch, 'i') } })
				.then((client) => {
					res.send(client)
				})
				.catch((err) => {
					res
						.status(500)
						.send({ message: err.message || 'usuário não encontrado.' })
				})
		},
	}
}

module.exports = usersController
