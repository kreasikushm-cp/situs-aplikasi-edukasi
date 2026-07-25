// Link CSV publikasi dari Google Sheets milik Pak Watono
const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQspC551cEQXJ1kqVR9zJ4pBtx18VjbrLpBitS_6SOm3REOtQ8KrNMXVilvTSY7maBTlOfelhCAXbGL/pub?output=csv";

async function loadAppsFromSheet() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // Memisah baris data dan mengabaikan baris judul/header paling atas
        const rows = data.split(/\r?\n/).slice(1);

        const apps = rows.filter(row => row.trim() !== '').map(row => {
            // Memisahkan kolom CSV
            const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(col => col.replace(/^"|"$/g, '').trim());
            
            return {
                id: cols[0] || '',
                nama: cols[1] || '',
                badge: cols[2] || '',
                deskripsi: cols[3] || '',
                gambar: cols[4] || '',
                linkDetail: cols[5] || '',
                linkWa: cols[6] || '',
                isFeatured: (cols[7] || '').toUpperCase() === 'TRUE'
            };
        });

        renderFeaturedApp(apps);
        renderAllApps(apps);
    } catch (error) {
        console.error("Gagal memuat data dari Google Sheets:", error);
    }
}

// Fungsi untuk membuat elemen Gambar/Galeri
function renderGallery(gambarString) {
    if (!gambarString) return '';
    // Pisahkan koma dan bersihkan spasi
    const images = gambarString.split(',').map(img => img.trim()).filter(img => img !== '');
    
    if (images.length === 0) return '';

    // Jika hanya 1 gambar
    if (images.length === 1) {
        return `
            <div style="text-align: center; margin: 15px 0;">
                <img src="${images[0]}" class="app-image" style="max-width: 100%; height: auto; border-radius: 8px;">
            </div>
        `;
    }
    
    // Jika lebih dari 1 gambar (Galeri)
    return `
        <div class="gallery-grid">
            ${images.map(img => `<img src="${img}" alt="Gambar Aplikasi">`).join('')}
        </div>
    `;
}

// Menampilkan Aplikasi Unggulan di Beranda (index.html)
function renderFeaturedApp(apps) {
    const container = document.getElementById('featured-app-container');
    if (!container) return;

    // Cari aplikasi yang kolom is_featured = TRUE di Google Sheets
    const featuredApp = apps.find(app => app.isFeatured) || apps[0];
    if (!featuredApp) {
        container.innerHTML = '<p style="text-align:center;">Belum ada data aplikasi.</p>';
        return;
    }

    container.innerHTML = `
        <div class="app-card">
            <h3>${featuredApp.nama}</h3>
            <span class="badge">${featuredApp.badge}</span>
            
            ${renderGallery(featuredApp.gambar)}
            
            <p style="margin-top: 15px;">${featuredApp.deskripsi}</p>
            
            <div style="margin-top: 15px;">
                <a href="${featuredApp.linkDetail}" class="btn">Detail Fitur Selengkapnya</a>
                <a href="${featuredApp.linkWa}" class="btn-wa" target="_blank">Hubungi via WhatsApp</a>
            </div>
        </div>
    `;
}

// Menampilkan Seluruh Aplikasi di Halaman Daftar Aplikasi (aplikasi.html)
function renderAllApps(apps) {
    const container = document.getElementById('all-apps-container');
    if (!container) return;

    if (apps.length === 0) {
        container.innerHTML = '<p style="text-align:center;">Belum ada data aplikasi.</p>';
        return;
    }

    container.innerHTML = apps.map(app => `
        <div class="app-card" style="margin-bottom: 25px;">
            <h3>${app.nama}</h3>
            <span class="badge">${app.badge}</span>
            
            ${renderGallery(app.gambar)}
            
            <p style="margin-top: 15px;">${app.deskripsi}</p>
            
            <div style="margin-top: 15px;">
                <a href="${app.linkDetail}" class="btn">Lihat Detail Fitur Lengkap</a>
                <a href="${app.linkWa}" class="btn-wa" target="_blank">Konsultasi via WhatsApp</a>
            </div>
        </div>
    `).join('');
}

// Jalankan fungsi setelah halaman selesai dimuat
document.addEventListener("DOMContentLoaded", loadAppsFromSheet);
