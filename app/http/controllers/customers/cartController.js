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
          // qty: 1,
          itemTotalQty: req.body.itemTotalQty,
          totalItemprice: req.body.itemTotalQty * req.body.saleSize.price,
        };
        cart.totalQty = cart.totalQty + 1;
        cart.totalPrice =
          cart.totalPrice + req.body.itemTotalQty * req.body.saleSize.price;
        cart.items[req.body._id].totalItemprice =
          req.body.saleSize.price * cart.items[req.body._id].itemTotalQty;
      } else {
        cart.items[req.body._id].itemTotalQty =
          cart.items[req.body._id].itemTotalQty + req.body.itemTotalQty;

        cart.items[req.body._id].totalItemprice =
          cart.items[req.body._id].totalItemprice +
          req.body.itemTotalQty * req.body.saleSize.price;

        cart.totalPrice =
          cart.totalPrice + req.body.itemTotalQty * req.body.saleSize.price;
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
      if (cart.items[req.body._id].itemTotalQty <= 1) {
        return;
      } else {
        cart.items[req.body._id].itemTotalQty =
          cart.items[req.body._id].itemTotalQty - 1;
        cart.totalQty = cart.totalQty - 1;
        cart.totalPrice = cart.totalPrice - req.body.saleSize.price;
        cart.items[req.body._id].totalItemprice =
          req.body.saleSize.price * cart.items[req.body._id].itemTotalQty;
        cart.items[req.body._id].itemTotalQty =
          cart.items[req.body._id].itemTotalQty -
          cart.items[req.body._id].itemTotalQty;
      }
      return res.json({
        totalQty: req.session.cart.totalQty,
        itemTotalQty: cart.items[req.body._id].itemTotalQty,
        itemTotalPrice: cart.items[req.body._id].totalItemprice,
        itemId: req.body._id,
        cartTotalPrice: cart.totalPrice,
      });
    },
    increaseItemQty(req, res) {
      let cart = req.session.cart;
      // Ver se não existe o item no carrinho
      cart.items[req.body._id].itemTotalQty =
        cart.items[req.body._id].itemTotalQty + 1;

      cart.totalQty = cart.totalQty + 1;
      cart.totalPrice = cart.totalPrice + req.body.saleSize.price;
      cart.items[req.body._id].totalItemprice =
        req.body.saleSize.price * cart.items[req.body._id].itemTotalQty;

      cart.items[req.body._id].itemTotalQty =
        cart.items[req.body._id].itemTotalQty +
        cart.items[req.body._id].itemTotalQty;

      return res.json({
        totalQty: req.session.cart.totalQty,
        itemTotalQty: cart.items[req.body._id].itemTotalQty,
        itemTotalPrice: cart.items[req.body._id].totalItemprice,
        itemId: req.body._id,
        cartTotalPrice: cart.totalPrice,
      });
    },
    removeItem(req, res) {
      let cart = req.session.cart;
      let productId = req.body._id;
      cart.totalQty = cart.totalQty - 1;

      if (cart.totalQty < 0) {
        cart.totalQty = 0;
      }
      let totalItemPrice = cart.items[req.body._id].totalItemprice;
      cart.totalPrice = cart.totalPrice - totalItemPrice;
      if (isNaN(cart.totalPrice)) {
        cart.totalPrice = 0.0;
      }
      delete cart.items[productId];

      return res.json({
        itemId: req.body._id,
        totalQty: cart.totalQty,
        cartTotalPrice: cart.totalPrice,
      });
    },
  };
}

module.exports = cartController;
