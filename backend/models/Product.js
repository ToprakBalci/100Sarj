const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  aciklama: { type: String, required: true },
  fiyat: { type: Number, required: true },
  resim: { type: String },
  kategori: { 
    type: String, 
    enum: ['100sarj-cihazlari', 'sarj-standi', 'sarj-adaptoru', 'usb-kablo'],
    required: true 
  },
  stok: { type: Number, default: 0 },
  aktif: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);