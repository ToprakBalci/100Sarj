const API = 'https://100sarj-production.up.railway.app/api';
const token = localStorage.getItem('token');

// Admin kontrolü
window.addEventListener('load', () => {
  const kullanici = JSON.parse(localStorage.getItem('kullanici') || '{}');
  if (!token || kullanici.rol !== 'admin') {
    alert('Bu sayfaya erişim yetkiniz yok!');
    window.location.href = 'giris.html';
  }
  urunleriYukle();
  siparisleriYukle();
});

function sekmeAc(sekme) {
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('aktif'));
  document.querySelectorAll('.admin-sidebar li').forEach(l => l.classList.remove('active'));
  document.getElementById(`tab-${sekme}`).classList.add('aktif');
  event.currentTarget.classList.add('active');
}

function cikisYap() {
  localStorage.removeItem('token');
  localStorage.removeItem('kullanici');
  window.location.href = 'giris.html';
}

// Ürünleri yükle
async function urunleriYukle() {
  try {
    const res = await fetch(`${API}/products`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const urunler = await res.json();
    const tbody = document.getElementById('urunTablo');
    if (!urunler.length) {
      tbody.innerHTML = '<tr><td colspan="5" style="text-align:center">Henüz ürün yok</td></tr>';
      return;
    }
    tbody.innerHTML = urunler.map(u => `
      <tr>
        <td>${u.ad}</td>
        <td>${u.kategori}</td>
        <td>${u.fiyat} TL</td>
        <td>${u.stok}</td>
        <td>
          <button class="islem-btn sil" onclick="urunSil('${u._id}')"><i class="fas fa-trash"></i> Sil</button>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    document.getElementById('urunTablo').innerHTML = '<tr><td colspan="5" style="text-align:center">Yüklenemedi</td></tr>';
  }
}

// Siparişleri yükle
async function siparisleriYukle() {
  try {
    const res = await fetch(`${API}/orders`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const siparisler = await res.json();
    const tbody = document.getElementById('siparisTablo');
    if (!siparisler.length) {
      tbody.innerHTML = '<tr><td colspan="6" style="text-align:center">Henüz sipariş yok</td></tr>';
      return;
    }
    tbody.innerHTML = siparisler.map(s => `
      <tr>
        <td>#${s._id.slice(-6).toUpperCase()}</td>
        <td>${s.kullanici?.ad || 'Bilinmiyor'} ${s.kullanici?.soyad || ''}</td>
        <td>${s.toplamFiyat} TL</td>
        <td><span class="durum-badge durum-${s.durum}">${s.durum}</span></td>
        <td>${new Date(s.createdAt).toLocaleDateString('tr-TR')}</td>
        <td>
          <select onchange="durumGuncelle('${s._id}', this.value)" style="padding:5px;border-radius:6px;border:1px solid #ddd">
            <option value="beklemede" ${s.durum==='beklemede'?'selected':''}>Beklemede</option>
            <option value="onaylandi" ${s.durum==='onaylandi'?'selected':''}>Onaylandı</option>
            <option value="kargoda" ${s.durum==='kargoda'?'selected':''}>Kargoda</option>
            <option value="teslim-edildi" ${s.durum==='teslim-edildi'?'selected':''}>Teslim Edildi</option>
            <option value="iptal" ${s.durum==='iptal'?'selected':''}>İptal</option>
          </select>
        </td>
      </tr>
    `).join('');
  } catch (e) {
    document.getElementById('siparisTablo').innerHTML = '<tr><td colspan="6" style="text-align:center">Yüklenemedi</td></tr>';
  }
}

// Ürün ekle
async function urunEkle() {
  const ad = document.getElementById('urunAd').value.trim();
  const aciklama = document.getElementById('urunAciklama').value.trim();
  const fiyat = document.getElementById('urunFiyat').value;
  const stok = document.getElementById('urunStok').value;
  const kategori = document.getElementById('urunKategori').value;
  const resim = document.getElementById('urunResim').value.trim();
  const hata = document.getElementById('formHata');
  const basari = document.getElementById('formBasari');

  if (!ad || !aciklama || !fiyat) {
    hata.style.display = 'block';
    hata.textContent = 'Ad, açıklama ve fiyat zorunludur!';
    return;
  }

  try {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ ad, aciklama, fiyat: Number(fiyat), stok: Number(stok), kategori, resim })
    });
    if (res.ok) {
      hata.style.display = 'none';
      basari.style.display = 'block';
      basari.textContent = '✅ Ürün başarıyla eklendi!';
      document.getElementById('urunAd').value = '';
      document.getElementById('urunAciklama').value = '';
      document.getElementById('urunFiyat').value = '';
      document.getElementById('urunStok').value = '';
      document.getElementById('urunResim').value = '';
      urunleriYukle();
      setTimeout(() => basari.style.display = 'none', 3000);
    }
  } catch (e) {
    hata.style.display = 'block';
    hata.textContent = 'Ürün eklenemedi!';
  }
}

// Ürün sil
async function urunSil(id) {
  if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
  try {
    await fetch(`${API}/products/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    urunleriYukle();
  } catch (e) {
    alert('Ürün silinemedi!');
  }
}

// Sipariş durumu güncelle
async function durumGuncelle(id, durum) {
  try {
    await fetch(`${API}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ durum })
    });
  } catch (e) {
    alert('Durum güncellenemedi!');
  }
}