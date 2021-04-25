const { json } = require('express');

function cartController() {
  return {
    index(req, res) {
      res.render('customers/cart');
    },
    update(req, res) {
      if (!req.session.cart) {
        req.session.cart = {
          items: {},
          totalQty: 0,
          totalPrice: 0,
        };
      }
      let cart = req.session.cart;

      // Ver se existe o item no carrinho
      if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice = cart.totalPrice + req.body.price;
      }
      return res.json({ totalQty: req.session.cart.totalQty });
    },
    decreaseItemQty(req, res) {
      // if (!req.session.cart) {
      //   req.session.cart = {
      //     items: {},
      //     totalQty: 0,
      //     totalPrice: 0,
      //   };
      // }
      let cart = req.session.cart;

      // Ver se não existe o item no carrinho
      if (cart.items[req.body._id].qty <= 1) {
        return;
      } else {
        cart.items[req.body._id].qty = cart.items[req.body._id].qty - 1;
        cart.totalQty = cart.totalQty - 1;
        cart.totalPrice = cart.totalPrice - req.body.price;
        cart.items[req.body._id].totalItemprice =
          req.body.price * cart.items[req.body._id].qty;
      }
      return res.json({
        totalQty: req.session.cart.totalQty,
        itemTotalQty: cart.items[req.body._id].qty,
        itemTotalPrice: cart.items[req.body._id].totalItemprice,
        itemId: req.body._id,
        cartTotalPrice: cart.totalPrice,
      });
    },
    increaseItemQty(req, res) {
      let cart = req.session.cart;

      // Ver se não existe o item no carrinho
      cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1;

      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.price;
      cart.items[req.body._id].totalItemprice =
        req.body.price * cart.items[req.body._id].qty;

      return res.json({
        totalQty: req.session.cart.totalQty,
        itemTotalQty: cart.items[req.body._id].qty,
        itemTotalPrice: cart.items[req.body._id].totalItemprice,
        itemId: req.body._id,
        cartTotalPrice: cart.totalPrice,
      });
    },
  };
}

module.exports = cartController;
