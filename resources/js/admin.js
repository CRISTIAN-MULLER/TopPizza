import axios from 'axios';
import moment from 'moment';
import Noty from 'noty';

export function initAdmin(socket) {
  const orderTableBody = document.querySelector('#orderTableBody');
  let orders = [];
  let markup;

  axios
    .get('/admin/orders', {
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    })
    .then((res) => {
      if (orderTableBody) {
        orders = res.data;
        markup = generateMarkup(orders);
        orderTableBody.innerHTML = markup;
      }
    })
    .catch((err) => {
      console.log(err);
    });

  function renderItems(items) {
    let parsedItems = Object.values(items);
    return parsedItems
      .map((menuItem) => {
        return `
                <p>${menuItem.item.name} - ${menuItem.itemTotalQty} ${menuItem.item.saleUnit.saleUnit}</p>
            `;
      })
      .join('');
  }

  function generateMarkup(orders) {
    return orders
      .map((order) => {
        return `
                <tr>
                <td class="border px-4 py-2 text-green-900">
                    <p>${order._id}</p>
                    <div>${renderItems(order.items)}</div>
                </td>
                <td class="border px-4 py-2">${order.customerId.username}</td>
                <td class="border px-4 py-2">
                ${order.address.street},
                ${order.address.houseNumber}, 
                ${order.address.district}</td>
                <td class="border px-4 py-2">${order.phone}</td>
                <td class="border px-4 py-2">
                    ${moment(order.createdAt).format('DD/MM/YYYY - HH:mm')}
                </td>
                <td class="border px-4 py-2">
                    ${order.paymentStatus ? 'paid' : 'Falta Pagamento'}
                </td>
                <td class="border px-4 py-2">
                    <div class="inline-block relative w-64">
                        <form action="/admin/order/status" method="POST">
                            <input type="hidden" name="orderId" value="${
                              order._id
                            }">
                            <select name="status" onchange="this.form.submit()"
                                class="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline">
                                <option value="order_placed"
                                    ${
                                      order.status === 'order_placed'
                                        ? 'selected'
                                        : ''
                                    }>
                                    Aberto</option>
                                <option value="confirmed" ${
                                  order.status === 'confirmed' ? 'selected' : ''
                                }>
                                    Confirmado</option>
                                <option value="preparation" ${
                                  order.status === 'preparation'
                                    ? 'selected'
                                    : ''
                                }>
                                    Em Preparação</option>
                                <option value="outfordelivery" ${
                                  order.status === 'outfordelivery'
                                    ? 'selected'
                                    : ''
                                }>
                                    Saiu para entrega
                                </option>
                                <option value="delivered" ${
                                  order.status === 'delivered' ? 'selected' : ''
                                }>
                                    Entregue
                                </option>
                                <option value="completed" ${
                                  order.status === 'completed' ? 'selected' : ''
                                }>
                                    Completo
                                </option>
                            </select>
                        </form>
                        <div
                            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20">
                                <path
                                    d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                        </div>
                         
                    </div>
                    
                </td>
                ${
                  order.observation
                    ? '<tr class="table-row"><td ><textarea class="w-full border px-4 py-2 row-span-2">' +
                      `${order.observation}` +
                      '</textarea></td></tr>'
                    : ''
                }
                
            </tr>
        `;
      })
      .join('');
  }
  // Socket
  socket.on('orderPlaced', (order) => {
    new Noty({
      type: 'success',
      timeout: 1000,
      text: 'Novo Pedido!',
      progressBar: false,
    }).show();
    orders.unshift(order);
    orderTableBody.innerHTML = '';
    orderTableBody.innerHTML = generateMarkup(orders);
  });
}
