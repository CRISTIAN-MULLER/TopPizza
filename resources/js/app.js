import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.getElementById('cartCounter');
let decreaseItemQty = document.querySelectorAll('.decreaseItemQty');
let cartAmount = document.getElementById('amount');
let increaseItemQty = document.querySelectorAll('.increaseItemQty');
let removeItem = document.querySelectorAll('.removeItem');
let categories = document.querySelectorAll('.categories');

let sizeSelected = document.querySelectorAll('.size');
let itemQuantity = document.querySelectorAll('.itemQuantity');

function updateCart(product) {
  axios
    .post('/update-cart', product)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
      new Noty({
        type: 'success',
        timeout: 1000,
        text: 'Item adicionado ao carrinho.',
        progressBar: false,
      }).show();
    })
    .catch((err) => {
      new Noty({
        type: 'error',
        timeout: 1000,
        text: 'Algo deu errado, tente novamente.',
        progressBar: false,
      }).show();
    });
}

function decreaseItemCartQty(product) {
  axios
    .put('/decrease-cart-item', product)
    .then((res) => {
      let productQty = document.getElementById('productQty' + res.data.itemId);

      let productItemTotal = document.getElementById(
        'productItemTotal' + res.data.itemId
      );

      productItemTotal.innerText = 'R$ ' + res.data.itemTotalPrice;
      productQty.innerText = res.data.itemTotalQty + ' UN';
      cartCounter.innerText = res.data.totalQty;
      cartAmount.innerText = 'R$ ' + res.data.cartTotalPrice;
    })
    .catch((err) => {
      console.log(err);
    });
}
function increaseItemCartQty(product) {
  axios
    .put('/increase-cart-item', product)
    .then((res) => {
      let productQty = document.getElementById('productQty' + res.data.itemId);
      let productItemTotal = document.getElementById(
        'productItemTotal' + res.data.itemId
      );

      productItemTotal.innerText = 'R$ ' + res.data.itemTotalPrice;
      productQty.innerText = res.data.itemTotalQty + ' UN';
      cartCounter.innerText = res.data.totalQty;
      cartAmount.innerText = 'R$ ' + res.data.cartTotalPrice;
    })
    .catch((err) => {
      console.log(err);
    });
}
function removeItemFromCart(product) {
  axios
    .put('/remove-cart-item', product)
    .then((res) => {
      let productData = document.getElementById(
        'productData' + res.data.itemId
      );
      productData.remove();

      cartCounter.innerText = res.data.totalQty;

      cartAmount.innerText = 'R$ ' + res.data.cartTotalPrice;
    })
    .catch((err) => {
      console.log(err);
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let productData = JSON.parse(btn.dataset.product);
    let isSelected = $('#itemQuantity' + productData._id)
      .prevUntil()
      .hasClass('Selected');
    if (!isSelected) {
      alert('Selecione uma Unidade de Venda');
      return;
    }

    updateCart(productData);
  });
});

decreaseItemQty.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let product = JSON.parse(btn.dataset.cart);
    decreaseItemCartQty(product);
  });
});

increaseItemQty.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let product = JSON.parse(btn.dataset.cart);
    increaseItemCartQty(product);
  });
});

removeItem.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let product = JSON.parse(btn.dataset.cart);
    removeItemFromCart(product);
  });
});

categories.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    console.log(addToCart);
  });
});

// Remove menssagem alerta depois X segundos
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Altera status do pedido
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.getElementById('hiddenInput');

let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');

function updateStatus(order) {
  statuses.forEach((status) => {
    status.classList.remove('step-completed');
    status.classList.remove('current');
  });
  let stepCompleted = true;
  statuses.forEach((status) => {
    let dataProp = status.dataset.status;
    if (stepCompleted) {
      status.classList.add('step-completed');
    }
    if (dataProp === order.status) {
      stepCompleted = false;
      time.innerText = moment(order.updatedAt).format('HH:mm');
      status.appendChild(time);
      status.classList.add('current');
      // if (status.nextElementSibling) {
      //   status.nextElementSibling.classList.add('current');
      // }
    }
  });
}

updateStatus(order);

// Socket

let socket = io();

// Join
if (order) {
  socket.emit('join', `order_${order._id}`);
}
let adminAreaPath = window.location.pathname;
if (adminAreaPath.includes('admin')) {
  initAdmin(socket);
  socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
  const updatedOrder = { ...order };
  updatedOrder.updatedAt = moment().format();
  updatedOrder.status = data.status;
  updateStatus(updatedOrder);
  new Noty({
    type: 'success',
    timeout: 1000,
    text: 'Pedido Atualizado',
    progressBar: false,
  }).show();
});

sizeSelected.forEach((btn) => {
  btn.addEventListener('click', () => {
    sizeSelected.forEach((btn) => {
      btn.classList.remove('Selected');
    }),
      btn.classList.add('Selected');
    let productData = JSON.parse(btn.dataset.product);
    let addToCartBtn = document.getElementById(productData._id);
    let product = JSON.parse(addToCartBtn.dataset.product);
    product.saleSize = JSON.parse(btn.dataset.salesize);
    product.itemTotalQty = 1;
    $('#itemQuantity' + productData._id).val('1');
    addToCartBtn.dataset.product = JSON.stringify(product);

    $('#totalPrice' + productData._id).text(function () {
      let totalItemprice = product.itemTotalQty * product.saleSize.price;
      if (isNaN(totalItemprice)) {
        return '0.00';
      } else {
        return totalItemprice;
      }
    });
  });
});

itemQuantity.forEach((input) => {
  input.addEventListener('input', () => {
    let productData = JSON.parse(input.dataset.product);
    let isSelected = $('#itemQuantity' + productData._id)
      .prevUntil()
      .hasClass('Selected');
    if (!isSelected) {
      alert('Selecione uma Unidade de Venda');
      return;
    }

    let addToCartBtn = document.getElementById(productData._id);
    let product = JSON.parse(addToCartBtn.dataset.product);
    product.itemTotalQty = parseFloat(input.value);
    addToCartBtn.dataset.product = JSON.stringify(product);

    $('#totalPrice' + productData._id).text(function () {
      let totalItemprice = product.itemTotalQty * product.saleSize.price;

      if (isNaN(totalItemprice)) {
        return '0.00';
      } else {
        return totalItemprice;
      }
    });
  });
});
