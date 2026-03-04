const API = 'http://localhost:5000/api';

function sekmeGec(sekme) {
  document.getElementById('girisBox').style.display = sekme === 'giris' ? 'block' : 'none';
  document.getElementById('kayitBox').style.display = sekme === 'kayit' ? 'block' : 'none';
}

async function girisYap() {
  const email = document.getElementById('girisEmail').value.trim();
  const sifre = document.getElementById('girisSifre').value.trim();
  const hata = document.getElementById('girisHata');

  if (!email || !sifre) {
    hata.style.display = 'block';
    hata.textContent = 'Email ve şifre boş bırakılamaz!';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/giris`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, sifre })
    });
    const data = await res.json();
    if (!res.ok) {
      hata.style.display = 'block';
      hata.textContent = data.mesaj;
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
    window.location.href = data.kullanici.rol === 'admin' ? 'admin.html' : 'index.html';
  } catch (e) {
    hata.style.display = 'block';
    hata.textContent = 'Sunucuya bağlanılamadı!';
  }
}

async function kayitOl() {
  const ad = document.getElementById('kayitAd').value.trim();
  const soyad = document.getElementById('kayitSoyad').value.trim();
  const telefon = document.getElementById('kayitTelefon').value.trim();
  const email = document.getElementById('kayitEmail').value.trim();
  const sifre = document.getElementById('kayitSifre').value.trim();
  const hata = document.getElementById('kayitHata');

  if (!ad || !soyad || !email || !sifre) {
    hata.style.display = 'block';
    hata.textContent = 'Tüm alanları doldurun!';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/kayit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ad, soyad, telefon, email, sifre })
    });
    const data = await res.json();
    if (!res.ok) {
      hata.style.display = 'block';
      hata.textContent = data.mesaj;
      return;
    }
    localStorage.setItem('token', data.token);
    localStorage.setItem('kullanici', JSON.stringify(data.kullanici));
    window.location.href = 'index.html';
  } catch (e) {
    hata.style.display = 'block';
    hata.textContent = 'Sunucuya bağlanılamadı!';
  }
}