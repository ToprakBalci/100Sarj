const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  kullanici: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  urunler: [
    {
      urun: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      adet: { type: Number, default: 1 },
      fiyat: { type: Number }
    }
  ],
  toplamFiyat: { type: Number, required: true },
  teslimatAdresi: { type: String, required: true },
  durum: { 
    type: String, 
    enum: ['beklemede', 'onaylandi', 'kargoda', 'teslim-edildi', 'iptal'],
    default: 'beklemede'
  },
  kargoTakipNo: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);