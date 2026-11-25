<!-- ALL Create by LamberthRumpaidus -->
<div align="center">
  <img src="./LAST_ASYLUM_logo.png" alt="Identitas visual LAST ASYLUM" width="340" />
  <h1>LAST ASYLUM</h1>
  <p>Permainan survival 3D, perburuan, dan pengelolaan markas.</p>
  <p><a href="https://lastasylumgame.netlify.app/">Mainkan</a> · <a href="https://github.com/lamberthrumpaidus/lamberthrumpaidus">Profil pengembang</a></p>
</div>

---

## Gambaran umum

LAST ASYLUM menggabungkan eksplorasi hutan, pertarungan melawan monster, pengelolaan bahan makanan, perdagangan, dan peningkatan karakter. Pemain menjalankan siklus bertahan hidup melalui perburuan dan pengelolaan sumber daya markas.

## Siklus permainan

| Tahap | Aktivitas |
|---|---|
| Eksplorasi | Menjelajahi hutan dan menghadapi ancaman |
| Perburuan | Mengumpulkan daging hewan |
| Produksi | Mengolah tiga daging menjadi satu sup |
| Perdagangan | Menjual sup kepada pelanggan |
| Pengembangan | Memanfaatkan koin untuk peningkatan karakter |

Markas memiliki jalur terpisah untuk pemburu dan pelanggan. Pemilihan bahan makanan memengaruhi kelangsungan permainan; bahan tercemar dapat mengakibatkan kegagalan.

## Teknologi dan struktur

JavaScript, WebGL, HTML, serta aset lokal. Halaman permainan berada pada `index.html` dengan kode pendukung dalam `js/` dan aset dalam `assets/`.

## Menjalankan secara lokal

```bash
git clone https://github.com/lamberthrumpaidus/Last-Asylum.git
cd Last-Asylum
python -m http.server 8000
```

Buka `http://localhost:8000/` melalui browser. Gunakan browser dengan dukungan grafis 3D.

---

<div align="center">
  <sub>Dikembangkan oleh <a href="https://github.com/lamberthrumpaidus/lamberthrumpaidus">Lamberth Rumpaidus</a></sub>
</div>
