
function profilGit() {
  const token = localStorage.getItem('token');
  window.location.href = token ? 'hesabim.html' : 'giris.html';
}

function sepetYukle() {
  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  const container = document.getElementById('sepetUrunler');

  if (!sepet.length) {
    container.innerHTML = '<div class="bos-sepet"><i class="fas fa-shopping-cart"></i><p>Sepetiniz boş</p><a href="urunler.html" class="btn-gold" style="margin-top:15px">Alışverişe Başla</a></div>';
    document.getElementById('araToplam').textContent = '0 TL';
    document.getElementById('genelToplam').textContent = '0 TL';
    return;
  }

  container.innerHTML = sepet.map((item, i) => `
    <div class="sepet-urun">
      <div style="width:80px;height:80px;background:#1a1a1a;border-radius:8px"></div>
      <div class="sepet-urun-bilgi">
        <h3>${item.ad}</h3>
        <p class="price">${item.fiyat}</p>
      </div>
      <div class="adet-kontrol">
        <button onclick="adetAzalt(${i})">-</button>
        <span>${item.adet}</span>
        <button onclick="adetArtir(${i})">+</button>
      </div>
      <button class="sil-btn" onclick="urunSil(${i})"><i class="fas fa-trash"></i></button>
    </div>
  `).join('');

  const toplam = sepet.reduce((t, i) => {
    const fiyat = parseFloat(i.fiyat.toString().replace(/[^0-9.]/g, '')) || 0;
    return t + fiyat * i.adet;
  }, 0);

  document.getElementById('araToplam').textContent = `${toplam.toFixed(2)} TL`;
  document.getElementById('genelToplam').textContent = `${toplam.toFixed(2)} TL`;
  document.getElementById('cartCount').textContent = sepet.reduce((t, i) => t + i.adet, 0);
}

function adetArtir(i) {
  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  sepet[i].adet++;
  localStorage.setItem('sepet', JSON.stringify(sepet));
  sepetYukle();
}

function adetAzalt(i) {
  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  if (sepet[i].adet > 1) sepet[i].adet--;
  else sepet.splice(i, 1);
  localStorage.setItem('sepet', JSON.stringify(sepet));
  sepetYukle();
}

function urunSil(i) {
  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  sepet.splice(i, 1);
  localStorage.setItem('sepet', JSON.stringify(sepet));
  sepetYukle();
}

async function siparisVer() {
  const token = localStorage.getItem('token');
  if (!token) {
    alert('Sipariş vermek için giriş yapmanız gerekiyor!');
    window.location.href = 'giris.html';
    return;
  }
  const adres = document.getElementById('teslimatAdresi').value.trim();
  if (!adres) { alert('Teslimat adresi girin!'); return; }

  const sepet = JSON.parse(localStorage.getItem('sepet')) || [];
  const toplam = sepet.reduce((t, i) => {
    const fiyat = parseFloat(i.fiyat.toString().replace(/[^0-9.]/g, '')) || 0;
    return t + fiyat * i.adet;
  }, 0);

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ urunler: sepet, toplamFiyat: toplam, teslimatAdresi: adres })
    });
    if (res.ok) {
      localStorage.removeItem('sepet');
      alert('Siparişiniz alındı! Teşekkürler 🎉');
      window.location.href = 'index.html';
    }
  } catch (e) {
    alert('Sipariş gönderilemedi, tekrar deneyin.');
  }
}

sepetYukle();