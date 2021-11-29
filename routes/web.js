var cloudinary = require('cloudinary').v2;

const homeController = require('../app/http/controllers/homeController');
const authController = require('../app/http/controllers/authController');
const usersController = require('../app/http/controllers/usersController');

const cartController = require('../app/http/controllers/customers/cartController');
const orderController = require('../app/http/controllers/customers/orderController');
const adminOrderController = require('../app/http/controllers/admin/orderController');
const statusController = require('../app/http/controllers/admin/statusController');

const path = require('path');
// Middlewares
const guest = require('../app/http/middlewares/guest');
const auth = require('../app/http/middlewares/auth');
const admin = require('../app/http/middlewares/admin');
const clientController = require('../app/http/controllers/admin/clientController');
const productController = require('../app/http/controllers/admin/productController');

const { default: slugify } = require('slugify');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img');
  },
  filename: (req, file, callback) => {
    const productName = req.body.name;
    const fileExtension = path.extname(file.originalname);
    callback(
      null,
      slugify(productName, {
        lower: true, // convert to lower case, defaults to `false`
      }) + fileExtension
    );
  },
});
const upload = multer({ storage });

function initRoutes(app) {
  app.get('/', homeController().index);
  app.get('/products', homeController().mobielIndex);
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
  app.post('/update-cart', cartController().updateCart);
  app.post('/add-to-cart', cartController().addToCart);
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
  app.get('/admin/clients', admin, clientController().index);
  app.post('/admin/clients/handleUser', admin, clientController().handleUser);
  app.get('/admin/products', admin, productController().index);
  app.post(
    '/admin/products/handleProduct',
    admin,
    upload.single('productImage'),
    productController().handleProduct
  );

  app.get(
    '/searchProductById/:productid',
    productController().searchProductById
  );
  app.get(
    '/searchProductByName/:productname',
    productController().searchProductByName
  );
}

module.exports = initRoutes;
