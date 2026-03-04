const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  ad: { type: String, required: true },
  soyad: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  sifre: { type: String, required: true },
  telefon: { type: String },
  tc: { type: String },
  googleId: { type: String },
  adres: { type: String },
  ilce: { type: String },
  sehir: { type: String },
  ulke: { type: String, default: 'Türkiye' },
  musteriGrubu: { type: String, enum: ['bireysel', 'kurumsal'], default: 'bireysel' },
  bulten: { type: String, default: 'hayir' },
  rol: { type: String, enum: ['kullanici', 'admin'], default: 'kullanici' }
}, { timestamps: true });

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('sifre')) return next();
  bcrypt.hash(user.sifre, 10, function(err, hash) {
    if (err) return next(err);
    user.sifre = hash;
    next();
  });
});

userSchema.methods.sifreKontrol = async function(girilenSifre) {
  return await bcrypt.compare(girilenSifre, this.sifre);
};

module.exports = mongoose.model('User', userSchema);