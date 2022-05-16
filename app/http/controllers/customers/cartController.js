const { json } = require('express')

function cartController() {
	return {
		index(req, res) {
			res.render('customers/cart')
		},
		updateCart(req, res) {
			let cart = req.session.cart

			// Ver se não existe o item no carrinho
			let cartItem = cart.items.find((item) => {
				return item.productId === req.body.productId
			})

			if (!cartItem) return

			cartItem.itemTotalQty = req.body.itemTotalQty
			cartItem.itemTotalPrice = cartItem.itemTotalQty * req.body.saleUnit.price

			cart.itemsTotalQty = cart.items.reduce(
				(previousValue, currentValue) =>
					previousValue + currentValue.itemTotalQty,
				0,
			)
			cart.itemsTotalPrice = cart.items.reduce(
				(previousValue, currentValue) =>
					parseFloat((previousValue + currentValue.itemTotalPrice).toFixed(2)),
				0,
			)

			return res.json({
				totalQty: req.session.cart.items.length,
				itemTotalQty: cartItem.itemTotalQty,
				itemTotalPrice: cartItem.itemTotalPrice,
				productId: req.body.productId,
				cartTotalPrice: cart.itemsTotalPrice,
			})
		},

		addToCart(req, res) {
			if (!req.session.cart) {
				req.session.cart = {
					items: [],
					itemsTotalQty: 0,
					itemsTotalPrice: 0,
				}
			}
			let cart = req.session.cart

			// Ver se existe o item no carrinho

			let cartItem = cart.items.find((item) => {
				return item.productId === req.body._id
			})

			if (!cartItem) {
				cartItem = {
					productId: req.body._id,
					name: req.body.name,
					image: req.body.image,
					saleUnit: {
						saleUnit: req.body.saleUnit.saleUnit,
						description: req.body.saleUnit.description,
						price: req.body.saleUnit.price,
						active: req.body.saleUnit.active,
					},
					itemTotalQty: req.body.itemTotalQty,
					itemTotalPrice: req.body.itemTotalQty * req.body.saleUnit.price,
				}
				cart.items.push(cartItem)

				cart.itemsTotalQty = cart.items.reduce(
					(previousValue, currentValue) =>
						previousValue + currentValue.itemTotalQty,
					0,
				)
				cart.itemsTotalPrice = cart.items.reduce(
					(previousValue, currentValue) =>
						parseFloat(
							(previousValue + currentValue.itemTotalPrice).toFixed(2),
						),
					0,
				)
			} else {
				cartItem.saleUnit = {
					saleUnit: req.body.saleUnit.saleUnit,
					description: req.body.saleUnit.description,
					price: req.body.saleUnit.price,
					active: req.body.saleUnit.active,
				}

				cartItem.itemTotalQty = req.body.itemTotalQty
				cartItem.itemTotalPrice =
					cartItem.itemTotalQty * req.body.saleUnit.price
				cart.itemsTotalQty = cart.items.reduce(
					(previousValue, currentValue) =>
						previousValue + currentValue.itemTotalQty,
					0,
				)

				cart.itemsTotalPrice = cart.items.reduce(
					(previousValue, currentValue) =>
						parseFloat(
							(previousValue + currentValue.itemTotalPrice).toFixed(2),
						),
					0,
				)
			}
			return res.json({ totalQty: req.session.cart.items.length })
		},

		// decreaseItemQty(req, res) {
		// 	let cart = req.session.cart

		// 	// Ver se não existe o item no carrinho
		// 	let cartItem = cart.items.find((item) => {
		// 		return item.productId === req.body._id
		// 	})

		// 	if (!cartItem) return

		// 	cartItem.itemTotalQty -= 1
		// 	cartItem.itemTotalPrice = cartItem.itemTotalQty * req.body.saleUnit.price

		// 	cart.itemsTotalQty = cart.items.reduce(
		// 		(previousValue, currentValue) =>
		// 			previousValue + currentValue.itemTotalQty,
		// 		0,
		// 	)
		// 	cart.itemsTotalPrice = cart.items.reduce(
		// 		(previousValue, currentValue) =>
		// 			parseFloat((previousValue + currentValue.itemTotalPrice).toFixed(2)),
		// 		0,
		// 	)

		// 	return res.json({
		// 		totalQty: req.session.cart.items.length,
		// 		itemTotalQty: cartItem.itemTotalQty,
		// 		itemTotalPrice: cartItem.totalItemprice,
		// 		itemId: req.body._id,
		// 		cartTotalPrice: cart.totalPrice,
		// 	})
		// },
		// increaseItemQty(req, res) {
		// 	let cart = req.session.cart
		// 	// Ver se não existe o item no carrinho
		// 	cart.items[req.body._id].itemTotalQty =
		// 		cart.items[req.body._id].itemTotalQty + 1

		// 	cart.totalQty = cart.totalQty + 1
		// 	cart.totalPrice = cart.totalPrice + req.body.saleUnit.price
		// 	cart.items[req.body._id].totalItemprice =
		// 		req.body.saleUnit.price * cart.items[req.body._id].itemTotalQty

		// 	cart.items[req.body._id].itemTotalQty =
		// 		cart.items[req.body._id].itemTotalQty +
		// 		cart.items[req.body._id].itemTotalQty

		// 	return res.json({
		// 		totalQty: req.session.cart.totalQty,
		// 		itemTotalQty: cart.items[req.body._id].itemTotalQty,
		// 		itemTotalPrice: cart.items[req.body._id].totalItemprice,
		// 		itemId: req.body._id,
		// 		cartTotalPrice: cart.totalPrice,
		// 	})
		// },

		removeItem(req, res) {
			let cart = req.session.cart

			// Ver se existe o item no carrinho
			let filteredCartItems = cart.items.filter((item) => {
				return item.productId != req.body.productId
			})

			cart.items = filteredCartItems

			cart.itemsTotalQty = cart.items.reduce(
				(previousValue, currentValue) =>
					previousValue + currentValue.itemTotalQty,
				0,
			)
			cart.itemsTotalPrice = cart.items.reduce(
				(previousValue, currentValue) =>
					parseFloat((previousValue + currentValue.itemTotalPrice).toFixed(2)),
				0,
			)
			return res.json({
				productId: req.body.productId,
				totalQty: cart.items.length,
				itemsTotalPrice: cart.itemsTotalPrice,
			})
		},
	}
}

module.exports = cartController
