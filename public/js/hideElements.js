let slct = document.querySelector('#paymentMethod');
let currencyChange = document.querySelector('#currencyChange');

if (slct !== null) {
  slct.addEventListener('click', () => {
    if (slct.value === 'currency') {
      currencyChange.style.display = 'flex';
    } else {
      currencyChange.style.display = 'none';
    }
  });
}

var clientOpenModal = document.querySelectorAll('.modal-client-open');
for (var i = 0; i < clientOpenModal.length; i++) {
  clientOpenModal[i].addEventListener('click', function (event) {
    event.preventDefault();
    toggleClientModal();
  });
}

var productOpenModal = document.querySelectorAll('.modal-product-open');
for (var i = 0; i < productOpenModal.length; i++) {
  productOpenModal[i].addEventListener('click', function (event) {
    event.preventDefault();
    toggleProductModal();
  });
}
// const overlay = document.querySelector('.modal-overlay');
// if (overlay !== null) {
//   overlay.addEventListener('click', toggleModal);
// }

var clientCloseModal = document.querySelectorAll('.client-modal-close');
for (var i = 0; i < clientCloseModal.length; i++) {
  clientCloseModal[i].addEventListener('click', function (event) {
    $('input[type=checkbox]').each(function () {
      $(this).off();
    });
    toggleClientModal();
    $('#searchUserBtn').trigger('click');
  });
}

var productCloseModal = document.querySelectorAll('.product-modal-close');
for (var i = 0; i < productCloseModal.length; i++) {
  productCloseModal[i].addEventListener('click', function (event) {
    $('input[type=checkbox]').each(function () {
      $(this).off();
    });
    toggleProductModal();
    $('#searchProductBtn').trigger('click');
  });
}

// document.onkeydown = function (evt) {
//   evt = evt || window.event;
//   var isEscape = false;
//   if ('key' in evt) {
//     isEscape = evt.key === 'Escape' || evt.key === 'Esc';
//   } else {
//     isEscape = evt.keyCode === 27;
//   }
//   if (isEscape && document.body.classList.contains('modal-active')) {
//     toggleClientModal();
//     toggleProductModal();
//   }
// };

function toggleClientModal() {
  const body = document.querySelector('body');
  const modal = document.querySelector('.clientModal');
  $('#handleProductForm').trigger('reset');
  $('#productSaleUnits td.productSaleUnit').remove();
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  body.classList.toggle('modal-active');
}

function toggleProductModal() {
  const body = document.querySelector('body');
  const modal = document.querySelector('.productModal');
  $('#handleProductForm').trigger('reset');
  $('#productSaleUnits td.productSaleUnit').remove();
  modal.classList.toggle('opacity-0');
  modal.classList.toggle('pointer-events-none');
  body.classList.toggle('modal-active');
}
