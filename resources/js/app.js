import axios from 'axios';
import Noty from 'noty';
import { initAdmin } from './admin';
import moment from 'moment';

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');
let decreaseItemQty = document.querySelectorAll('.decreaseItemQty');
let increaseItemQty = document.querySelectorAll('.increaseItemQty');
let sizeSelected = document.querySelectorAll('.size');
let halfSelected = document.querySelectorAll('input[type="checkbox"]');

function updateCart(pizza) {
  axios
    .post('/update-cart', pizza)
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

function decrease(pizza) {
  axios
    .post('/update-cart', pizza)
    .then((res) => {
      cartCounter.innerText = res.data.totalQty;
    })
    .catch((err) => {
      console.log(err);
    });
}

addToCart.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let pizza = JSON.parse(btn.dataset.pizza);
    updateCart(pizza);
  });
});

decreaseItemQty.forEach((btn) => {
  btn.addEventListener('click', (e) => {
    let cart = btn.dataset.cart;
    console.log(cart);
  });
});

// Remove alert message after X seconds
const alertMsg = document.querySelector('#success-alert');
if (alertMsg) {
  setTimeout(() => {
    alertMsg.remove();
  }, 2000);
}

// Change order status
let statuses = document.querySelectorAll('.status_line');
let hiddenInput = document.querySelector('#hiddenInput');
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
      if (status.nextElementSibling) {
        status.nextElementSibling.classList.add('current');
      }
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
    text: 'Order updated',
    progressBar: false,
  }).show();
});

sizeSelected.forEach((btn) => {
  btn.addEventListener('click', () => {
    sizeSelected.forEach((btn) => {
      btn.classList.remove('Selected');
    }),
      btn.classList.add('Selected');
    let pizzaData = JSON.parse(btn.dataset.pizza);
    let addToCartBtn = document.getElementById(pizzaData._id);
    let pizza = JSON.parse(addToCartBtn.dataset.pizza);
    pizza.size = btn.id;

    halfSelected.forEach((btn) => {
      btn.dataset.pizza = JSON.stringify(pizza);
    });
    addToCartBtn.dataset.pizza = JSON.stringify(pizza);
  });
});

halfSelected.forEach((btn) => {
  btn.addEventListener('change', (btn) => {
    let pizzaData = JSON.parse(btn.target.dataset.pizza);

    if (btn.target.checked) {
      let pizzaData = JSON.parse(btn.target.dataset.pizza);

      $('input[type="checkbox"]').prop('checked', true);
      //$('.size').removeClass('Selected');
      $('.size#' + pizzaData.size).addClass('Selected');
      return;
    }
    $('input[type="checkbox"]').prop('checked', false);
    //$('.size').removeClass('Selected');
    $('.size#' + pizzaData.size).removeClass('Selected');
  });
});
