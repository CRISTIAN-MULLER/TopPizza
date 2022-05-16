const Order = require('../../../models/order')
const User = require('../../../models/user')

function orderController() {
	return {
		index(req, res) {
			Order.find({ status: { $ne: 'completed' } }, null, {
				sort: { createdAt: -1 },
			})
				.populate('customerId', '-password')
				.exec((err, orders) => {
					if (req.xhr) {
						return res.json(orders)
					} else {
						return res.render('admin/orders')
					}
				})
		},
		store(req, res) {
			if (req.body.id === '' || req.body.id === undefined) {
				const {
					username,
					phone,
					zipcode,
					street,
					houseNumber,
					district,
					city,
					state,
					reference,
				} = req.body

				//Create a user
				const user = new User({
					username,
					phone,
					address: {
						zipcode,
						street,
						houseNumber,
						district,
						city,
						state,
						reference,
					},
				})

				user
					.save()
					.then((user) => {
						putOrder(user)
					})
					.catch((err) => {
						console.log(err)
					})
			} else {
				const user = {
					_id: req.body.id,
					phone: req.body.phone,
					address: {
						zipcode: req.body.zipcode,
						street: req.body.street,
						houseNumber: req.body.houseNumber,
						district: req.body.district,
						city: req.body.city,
						state: req.body.state,
						reference: req.body.reference,
					},
				}
				putOrder(user)
			}

			function putOrder(user) {
				const order = new Order({
					customerId: user._id,
					items: req.session.cart.items,
					phone: user.phone,
					deliveryAddress: {
						zipcode: user.address.zipcode,
						street: user.address.street,
						houseNumber: user.address.houseNumber,
						district: user.address.district,
						city: user.address.city,
						state: user.address.state,
						reference: user.address.reference,
					},

					paymentMethod: req.body.paymentMethodValue,
					entryPoint: req.body.entryPointValue,
				})

				order
					.save()
					.then((result) => {
						req.flash('success', 'Pedido feito com sucesso')
						delete req.session.cart
						return res.redirect('/admin/orders')
					})
					.catch((err) => {
						req.flash('error', 'Algo deu errado, tente novamente.')
						console.log(err)
						return res.redirect('/cart')
					})
			}
		},
	}
}

module.exports = orderController
