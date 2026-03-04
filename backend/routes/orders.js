const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const supabase = require('../config/db');

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ mesaj: 'Yetkisiz erişim' });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.kullanici = decoded;
    next();
  } catch {
    res.status(401).json({ mesaj: 'Geçersiz token' });
  }
};

// Sipariş oluştur
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { urunler, toplamFiyat, teslimatAdresi } = req.body;
    const { data, error } = await supabase.from('orders').insert([{
      kullanici_id: req.kullanici.id,
      urunler,
      toplam_fiyat: toplamFiyat,
      teslimat_adresi: teslimatAdresi
    }]).select().single();
    if (error) return res.status(500).json({ mesaj: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Kullanıcının siparişleri
router.get('/benim', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*').eq('kullanici_id', req.kullanici.id).order('created_at', { ascending: false });
    if (error) return res.status(500).json({ mesaj: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Tüm siparişler (admin)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').select('*, users(ad, soyad, email)').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ mesaj: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Sipariş durumu güncelle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('orders').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ mesaj: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

module.exports = router;