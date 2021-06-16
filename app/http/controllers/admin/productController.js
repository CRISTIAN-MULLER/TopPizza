const Product = require('../../../models/product');
const multer = require('multer');
const path = require('path');
const console = require('console');
const imageMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];

const upload = multer({
  dest: path.join(__dirname, 'public/img'),
  fileFilter: (req, file, callback) => {
    callback(null);
  },
});

function productController() {
  return {
    async index(req, res) {
      const products = await Product.find();
      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];
      return res.render('admin/products', {
        products: products,
        categories: categories,
      });
    },

    async handleProduct(req, res) {
      const productData = {
        id: req.body.id,
        name: req.body.name,
        image: req.body.image,
        saleUnits: req.body.saleUnit.map((unit, i) => ({
          saleUnit: unit,
          price: parseFloat(
            req.body.price[i].replace(/,/, '.').replace(/[^0-9.]+/, '')
          ),
          description: req.body.description[i],
          active: req.body.active[i] == 1 ? true : false,
        })),
        category: req.body.category,
        active: req.body.productActive == 1 ? true : false,
      };

      //checa se tem id no body da requisição, se tiver atualiza o cliente
      //se não, cria um novo.
      if (!req.body.id) {
        const product = new Product(productData);

        await product
          .save()
          .then((product) => {
            return product;
          })
          .catch((err) => {
            console.log(err);
            req.flash('error', 'Algo deu errado, tente novamente');
            //  return res.redirect('/admin/clients');
          });
      } else {
        const productId = productData.id;

        await Product.findByIdAndUpdate(
          productId,
          productData,
          function (err, product) {
            if (err) {
              console.log(err);
              // return res.redirect('/admin/clients');
            } else {
              return product;
            }
          }
        );
      }
    },

    async searchProductById(req, res) {
      const idToSearch = req.params.productid;

      Product.findById(idToSearch)

        .then((Product) => {
          res.send(Product);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'Produto não encontrado.' });
        });
    },

    async searchProductByName(req, res) {
      const productToSearch = req.params.productname;

      if (productToSearch == 'all') {
        await Product.find()
          .then((products) => {
            res.send(products);
          })
          .catch((err) => {
            res
              .status(500)
              .send({ message: err.message || 'Produto não encontrado.' });
          });
        return;
      }

      await Product.find({ name: { $regex: new RegExp(productToSearch, 'i') } })
        .then((product) => {
          res.send(product);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'Produto não encontrado.' });
        });
    },
  };
}

module.exports = productController;
