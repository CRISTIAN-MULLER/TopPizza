let slct = document.querySelector('#paymentMethod');
let currencyChange = document.querySelector('#currencyChange');

slct.addEventListener('click', () => {
  if (slct.value === 'currency') {
    currencyChange.style.display = 'flex';
  } else {
    currencyChange.style.display = 'none';
  }
});
