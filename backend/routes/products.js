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

// Tüm ürünleri getir
router.get('/', async (req, res) => {
  try {
    const { kategori } = req.query;
    let query = supabase.from('products').select('*').eq('aktif', true);
    if (kategori) query = query.eq('kategori', kategori);
    const { data, error } = await query;
    if (error) return res.status(500).json({ mesaj: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Tek ürün
router.get('/:id', async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').select('*').eq('id', req.params.id).single();
    if (error) return res.status(404).json({ mesaj: 'Ürün bulunamadı' });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Ürün ekle
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { ad, aciklama, fiyat, stok, kategori, resim } = req.body;
    const { data, error } = await supabase.from('products').insert([{ ad, aciklama, fiyat, stok, kategori, resim }]).select().single();
    if (error) return res.status(500).json({ mesaj: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Ürün güncelle
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { data, error } = await supabase.from('products').update(req.body).eq('id', req.params.id).select().single();
    if (error) return res.status(500).json({ mesaj: error.message });
    res.json(data);
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

// Ürün sil
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await supabase.from('products').update({ aktif: false }).eq('id', req.params.id);
    res.json({ mesaj: 'Ürün silindi' });
  } catch (err) {
    res.status(500).json({ mesaj: err.message });
  }
});

module.exports = router;