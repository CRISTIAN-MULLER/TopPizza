const mongoose = require('mongoose');
const Float = require('mongoose-float').loadType(mongoose);
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  image: { type: String, required: true },
  saleUnits: [
    {
      saleUnit: { type: String, required: true },
      price: { type: Float, required: true },
      description: { type: String },
    },
  ],
  category: { type: String, required: true },
  active: { type: Boolean, default: true },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;
