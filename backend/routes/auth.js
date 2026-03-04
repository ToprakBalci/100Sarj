const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/db');

// Kayıt ol
router.post('/kayit', async (req, res) => {
  try {
    const { ad, soyad, email, sifre, telefon, tc, adres, ilce, sehir, ulke, musteriGrubu, bulten } = req.body;

    const { data: mevcut } = await supabase.from('users').select('id').eq('email', email).single();
    if (mevcut) return res.status(400).json({ mesaj: 'Bu email zaten kayıtlı' });

    const hash = await bcrypt.hash(sifre, 10);
    const { data, error } = await supabase.from('users').insert([{
      ad, soyad, email, sifre: hash, telefon, tc, adres, ilce, sehir, ulke,
      musteri_grubu: musteriGrubu, bulten
    }]).select().single();

    if (error) return res.status(500).json({ mesaj: error.message });

    const token = jwt.sign({ id: data.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.status(201).json({ token, kullanici: { id: data.id, ad, soyad, email, rol: data.rol } });
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Giriş yap
router.post('/giris', async (req, res) => {
  try {
    const { email, sifre } = req.body;
    const { data: kullanici } = await supabase.from('users').select('*').eq('email', email).single();
    if (!kullanici) return res.status(400).json({ mesaj: 'Email veya şifre hatalı' });

    const dogru = await bcrypt.compare(sifre, kullanici.sifre);
    if (!dogru) return res.status(400).json({ mesaj: 'Email veya şifre hatalı' });

    const token = jwt.sign({ id: kullanici.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, kullanici: { id: kullanici.id, ad: kullanici.ad, email, rol: kullanici.rol } });
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Google ile giriş
router.post('/google', async (req, res) => {
  try {
    const { email, ad, soyad, googleId } = req.body;
    let { data: kullanici } = await supabase.from('users').select('*').eq('email', email).single();

    if (!kullanici) {
      const hash = await bcrypt.hash(googleId + process.env.JWT_SECRET, 10);
      const { data, error } = await supabase.from('users').insert([{
        ad: ad || 'Kullanıcı',
        soyad: soyad || '-',
        email,
        sifre: hash,
        google_id: googleId
      }]).select().single();
      if (error) return res.status(500).json({ mesaj: error.message });
      kullanici = data;
    }

    const token = jwt.sign({ id: kullanici.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    res.json({ token, kullanici: { id: kullanici.id, ad: kullanici.ad, email, rol: kullanici.rol } });
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

module.exports = router;