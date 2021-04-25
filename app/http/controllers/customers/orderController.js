const Order = require('../../../models/order');
const moment = require('moment');

function orderController(e) {
  return {
    store(req, res) {
      const {
        phone,
        zipcode,
        street,
        houseNumber,
        district,
        city,
        state,
        reference,
        paymentMethod = req.body.paymentMethodValue,
        entryPoint = 'Site',
      } = req.body;

      const order = new Order({
        customerId: req.user._id,
        items: req.session.cart.items,
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
        paymentMethod,
        entryPoint,
      });

      order
        .save()
        .then((result) => {
          req.flash('success', 'Pedido feito com sucesso');
          delete req.session.cart;
          return res.redirect('/customer/orders');
        })
        .catch((err) => {
          req.flash('error', 'Algo deu errado, tente novamente.');
          console.log(err);
          return res.redirect('/cart');
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
      // @ts-ignore
      if (req.user._id.toString() === order.customerId.toString()) {
        return res.render('customers/singleOrder', { order });
      }
      return res.redirect('/');
    },
  };
}
module.exports = orderController;
