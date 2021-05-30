const Product = require('../../../models/product');

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
        id: req.body.id ? req.body.id : '',
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
      };

      //checa se tem id no body da requisição, se tiver atualiza o cliente
      //se não, cria um novo.
      if (!req.body.id) {
        const product = new Menu(productData);

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

        await Menu.findByIdAndUpdate(
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
  };
}

module.exports = productController;
