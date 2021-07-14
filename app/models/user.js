const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      trim: true,
      unique: true,
      spare: true,
    },
    phone: { type: String, required: false },
    address: {
      zipcode: { type: String, required: false },
      street: { type: String, required: false },
      houseNumber: { type: Number, required: false },
      district: { type: String, required: false },
      city: { type: String, required: false },
      state: { type: String, required: false },
      reference: { type: String, required: false },
    },
    password: { type: String, required: false },
    role: { type: String, default: 'customer' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
