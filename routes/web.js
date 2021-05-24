const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const usersController = require('../app/http/controllers/usersController');

const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

// Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const clientController = require('../app/http/controllers/admin/clientController');

function initRoutes(app) {
  app.get('/', homeController().index);
  app.get('/login', guest, authController().login);
  app.post('/login', authController().postLogin);
  app.get('/register', guest, authController().register);
  app.post('/register', authController().postRegister);
  app.post('/logout', authController().logout);

  app.get('/searchClientById/:clientid', usersController().searchClientById);
  app.get(
    '/searchClientByName/:clientname',
    usersController().searchClientByName
  );
  app.get('/searchClientByPhone/:phone', usersController().searchClientByPhone);

  app.get('/cart', cartController().index);
  app.post('/update-cart', cartController().update);
  app.put('/decrease-cart-item', cartController().decreaseItemQty);
  app.put('/increase-cart-item', cartController().increaseItemQty);
  app.put('/remove-cart-item', cartController().removeItem);
  // Customer routes
  app.post('/customer/order', auth, orderController().store);
  app.get('/customer/orders', auth, orderController().index);
  app.get('/customer/orders/:id', auth, orderController().show);

  // Admin routes
  app.post('/admin/order', admin, adminOrderController().store);
  app.get('/admin/orders', admin, adminOrderController().index);
  app.post('/admin/order/status', admin, statusController().update);
  app.get('/admin/clients', clientController().index);
  app.post('/admin/clients/handleUser', clientController().handleUser);
}

module.exports = initRoutes;
