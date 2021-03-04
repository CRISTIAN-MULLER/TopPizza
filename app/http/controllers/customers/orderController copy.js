const Order = require('../../../models/order');
const moment = require('moment');

function orderController() {
  return {
    store(req, res) {
      // Validate request
      const { phone, address, paymentMethod } = req.body;
      if (!phone || !address) {
        return res
          .status(422)
          .json({ message: 'Todos os campos são obrigatórios' });
      }

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
        phone,
        address,
      });
      order
        .save()
        .then((result) => {
          Order.populate(result, { path: 'customerId' }, (err, placedOrder) => {
            // req.flash('success', 'Order placed successfully')

            if (paymentMethod === 'card') {
              delete req.session.cart;
              return res.json({ message: 'Pedido gerado com sucesso.' });
            }
          });
        })
        .catch((err) => {
          return res
            .status(500)
            .json({ message: 'Algo deu errado, tente novamente.' });
        });
    },
    async index(req, res) {
      const orders = await Order.find({ customerId: req.user._id }, null, {
        sort: { createdAt: -1 },
      });
      res.header('Cache-Control', 'no-store');
      res.render('customers/orders', { orders: orders, moment: moment });
    },
    async show(req, res) {
      const order = await Order.findById(req.params.id);
      // Authorize user
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render('customers/singleOrder', { order });
      }
      return res.redirect('/');
    },
  };
}

module.exports = orderController;
