const API = 'https://100sarj-production.up.railway.app/api';

// Sepet
let sepet = JSON.parse(localStorage.getItem('sepet')) || [];
let favori = JSON.parse(localStorage.getItem('favori')) || [];

function sepetGuncelle() {
  const toplam = sepet.reduce((t, i) => t + i.adet, 0);
  document.querySelectorAll('#cartCount').forEach(el => el.textContent = toplam);
  localStorage.setItem('sepet', JSON.stringify(sepet));

  const dropdown = document.getElementById('cartDropdownItems');
  if (!dropdown) return;
  if (!sepet.length) {
    dropdown.innerHTML = '<p class="cart-dropdown-bos">Sepetiniz boş</p>';
    return;
  }
  dropdown.innerHTML = sepet.map(i => `
    <div class="cart-dropdown-item">
      <span>${i.ad}</span>
      <span>${i.adet} adet</span>
    </div>
  `).join('');
}

function favoriGuncelle() {
  const el = document.getElementById('wishlistCount');
  if (el) el.textContent = favori.length;
  localStorage.setItem('favori', JSON.stringify(favori));
}

function sepeteEkle(btn) {
  const kart = btn.closest('.product-card');
  const ad = kart.querySelector('h3').textContent;
  const fiyat = kart.querySelector('.price').textContent;
  const mevcut = sepet.find(i => i.ad === ad);
  if (mevcut) mevcut.adet++;
  else sepet.push({ ad, fiyat, adet: 1 });
  sepetGuncelle();
  btn.textContent = '✓ Eklendi';
  btn.style.background = '#28a745';
  setTimeout(() => { btn.textContent = 'Sepete Ekle'; btn.style.background = ''; }, 1500);
}

// Ürünleri API'den yükle
async function urunleriYukle() {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  try {
    const res = await fetch(`${API}/products`);
    const urunler = await res.json();
    if (!urunler.length) return;
    grid.innerHTML = '';
    urunler.forEach(u => {
      grid.innerHTML += `
        <div class="product-card">
          <img class="product-img" src="${u.resim || 'images/placeholder.jpg'}" alt="${u.ad}" onerror="this.src='images/placeholder.jpg'"/>
          <h3>${u.ad}</h3>
          <p class="price">${u.fiyat} TL</p>
          <button class="btn-gold" onclick="sepeteEkle(this)">Sepete Ekle</button>
        </div>`;
    });
  } catch (e) {
    console.log('API bağlantısı yok, placeholder gösteriliyor');
  }
}

// Arama
document.getElementById('searchInput')?.addEventListener('keyup', function(e) {
  if (e.key === 'Enter') {
    window.location.href = `urunler.html?ara=${this.value}`;
  }
});

// Başlat
sepetGuncelle();
favoriGuncelle();
urunleriYukle();