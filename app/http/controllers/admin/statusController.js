const Order = require('../../../models/order')

function statusController() {
	return {
		update(req, res) {
			const orderStatus = JSON.parse(req.body.order_status)
			console.log(orderStatus)

			Order.updateOne(
				{ _id: req.body.orderId },
				{
					status: orderStatus.status,
					step: orderStatus.step,
				},

				(err, data) => {
					if (err) {
						return res.redirect('/admin/orders')
					}
					// Emit event
					const eventEmitter = req.app.get('eventEmitter')
					eventEmitter.emit('orderUpdated', {
						id: req.body.orderId,
						status: orderStatus.status,
					})
					return res.redirect('/admin/orders')
				},
			)
		},
	}
}

module.exports = statusController
