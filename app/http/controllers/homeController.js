const Product = require('../../models/product');

function homeController() {
  return {
    async index(req, res) {
      const products = await Product.find();
      const categories = [
        ...new Set(products.map((product) => product.category)),
      ];
      return res.render('home', { products: products, categories: categories });
    },
  };
}

module.exports = homeController;
