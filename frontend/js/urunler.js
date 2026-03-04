const API = 'http://localhost:5000/api';
let tumUrunler = [];

async function urunleriYukle() {
  const params = new URLSearchParams(window.location.search);
  const kategori = params.get('kategori');
  const ara = params.get('ara');
  const grid = document.getElementById('productsGrid');
  const baslik = document.getElementById('kategoriBaslik');

  const kategoriAdlari = {
    '100sarj-cihazlari': '100Şarj Cihazları',
    'sarj-standi': 'Şarj Standı',
    'sarj-adaptoru': 'Şarj Adaptörleri',
    'usb-kablo': 'USB Kablo'
  };
  if (baslik) baslik.textContent = kategori ? (kategoriAdlari[kategori] || 'Ürünler') : ara ? `"${ara}" Sonuçları` : 'Tüm Ürünler';

  try {
    let url = `${API}/products`;
    if (kategori) url += `?kategori=${kategori}`;
    const res = await fetch(url);
    tumUrunler = await res.json();

    if (ara) tumUrunler = tumUrunler.filter(u => u.ad.toLowerCase().includes(ara.toLowerCase()));

    urunleriGoster(tumUrunler);
  } catch (e) {
    grid.innerHTML = '<div class="yukleniyor">Ürünler yüklenirken hata oluştu. Sunucunun çalıştığından emin olun.</div>';
  }
}

function urunleriGoster(urunler) {
  const grid = document.getElementById('productsGrid');
  if (!urunler.length) {
    grid.innerHTML = '<div class="yukleniyor">Ürün bulunamadı.</div>';
    return;
  }
  grid.innerHTML = urunler.map(u => `
    <div class="product-card" data-id="${u._id}">
      <img class="product-img" src="${u.resim || 'images/placeholder.jpg'}" alt="${u.ad}" onerror="this.src='images/placeholder.jpg'"/>
      <h3>${u.ad}</h3>
      <p class="price">${u.fiyat} TL</p>
      <button class="btn-gold" onclick="sepeteEkle(this)">Sepete Ekle</button>
    </div>
  `).join('');
}

// Sıralama
document.getElementById('sirala')?.addEventListener('change', function() {
  let siralandi = [...tumUrunler];
  if (this.value === 'fiyat-artan') siralandi.sort((a, b) => a.fiyat - b.fiyat);
  if (this.value === 'fiyat-azalan') siralandi.sort((a, b) => b.fiyat - a.fiyat);
  urunleriGoster(siralandi);
});

// Fiyat filtre
document.getElementById('fiyatRange')?.addEventListener('input', function() {
  document.getElementById('fiyatDeger').textContent = this.value;
  const filtreli = tumUrunler.filter(u => u.fiyat <= this.value);
  urunleriGoster(filtreli);
});

urunleriYukle();