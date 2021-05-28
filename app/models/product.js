const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  saleSizes: [
    {
      saleSize: { type: String, required: true },
      price: { type: Number, required: true },
    },
  ],
  category: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
