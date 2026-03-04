require('dotenv').config();
const bcrypt = require('bcryptjs');
const supabase = require('./config/db');

async function adminOlustur() {
  const { data: mevcut } = await supabase.from('users').select('id').eq('email', 'admin@100sarj.com').single();
  if (mevcut) {
    console.log('✅ Admin zaten mevcut!');
    process.exit();
  }

  const hash = await bcrypt.hash('admin123', 10);
  const { data, error } = await supabase.from('users').insert([{
    ad: 'Admin',
    soyad: '100Sarj',
    email: 'admin@100sarj.com',
    sifre: hash,
    rol: 'admin',
    telefon: '05325197254'
  }]).select().single();

  if (error) {
    console.log('❌ Hata:', error.message);
  } else {
    console.log('✅ Admin oluşturuldu!');
    console.log('Email: admin@100sarj.com');
    console.log('Şifre: admin123');
  }
  process.exit();
}

adminOlustur();