const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    items: { type: Object, required: true },
    phone: { type: String, required: true },
    address: {
      zipcode: { type: String, required: true },
      street: { type: String, required: true },
      houseNumber: { type: Number, required: true },
      district: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      reference: { type: String, required: true },
    },
    paymentMethod: { type: String, default: 'COD' },
    paymentStatus: { type: Boolean, default: false },
    entryPoint: { type: String, required: true },
    observation: { type: String },
    status: { type: String, default: 'order_placed' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
