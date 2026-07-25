const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQspC551cEQXJ1kqVR9zJ4pBtx18VjbrLpBitS_6SOm3REOtQ8KrNMXVilvTSY7maBTlOfelhCAXbGL/pub?output=csv";

async function loadAppsFromSheet() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
        
        // Memisah baris data dan mengabaikan baris judul/header
        const rows = data.split(/\r?\n/).slice(1);

        const apps = rows.filter(row => row.trim() !== '').map(row => {
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

// Menampilkan Aplikasi Unggulan di Beranda (index.html)
function renderFeaturedApp(apps) {
    const container = document.getElementById('featured-app-container');
    if (!container) return;

    // Cari aplikasi yang status is_featured = TRUE
    const featuredApp = apps.find(app => app.isFeatured) || apps[0];
    if (!featuredApp) return;

    container.innerHTML = `
        <div class="app-card">
            <h3>${featuredApp.nama}</h3>
            <span class="badge">${featuredApp.badge}</span>
            <div style="text-align: center; margin: 15px 0;">
                <img src="${featuredApp.gambar}" alt="${featuredApp.nama}" class="app-image">
            </div>
            <p>${featuredApp.deskripsi}</p>
            <a href="${featuredApp.linkDetail}" class="btn">Detail Fitur Selengkapnya</a>
            <a href="${featuredApp.linkWa}" class="btn-wa" target="_blank">Hubungi via WhatsApp</a>
        </div>
    `;
}

// Menampilkan Seluruh Aplikasi di Halaman Daftar Aplikasi (aplikasi.html)
function renderAllApps(apps) {
    const container = document.getElementById('all-apps-container');
    if (!container) return;

    container.innerHTML = apps.map(app => `
        <div class="app-card">
            <h3>${app.nama}</h3>
            <span class="badge">${app.badge}</span>
            <div style="text-align: center; margin: 15px 0;">
                <img src="${app.gambar}" alt="${app.nama}" class="app-image">
            </div>
            <p>${app.deskripsi}</p>
            <a href="${app.linkDetail}" class="btn">Lihat Detail Fitur Lengkap</a>
            <a href="${app.linkWa}" class="btn-wa" target="_blank">Konsultasi via WhatsApp</a>
        </div>
    `).join('');
}

document.addEventListener("DOMContentLoaded", loadAppsFromSheet);
