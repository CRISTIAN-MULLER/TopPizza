const Product = require('../../models/product');

function homeController() {
  return {
    async index(req, res) {
      const products = await Product.find({ active: true });

      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];
      return res.render('home', { products: products, categories: categories });
    },

    async mobielIndex(req, res) {
      const products = await Product.find({ active: true })
        .then((Products) => {
          res.send(Products);
        })
        .catch((err) => {
          res
            .status(500)
            .send({ message: err.message || 'Deu ruim so pegar os livros' });
        });

      // const categories = [
      //   ...new Set(products.map((product) => product.category)),
      // ];
      // res.send(products, categories);
    },
  };
}

module.exports = homeController;
