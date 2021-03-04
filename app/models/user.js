const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: Number, required: false },
    address: {
      zipcode: { type: Number, required: false },
      street: { type: String, required: false },
      houseNumber: { type: Number, required: false },
      district: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, default: 'ES' },
    },
    password: { type: String, required: true },
    role: { type: String, default: 'customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
