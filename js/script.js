const SHEET_CSV_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQspC551cEQXJ1kqVR9zJ4pBtx18VjbrLpBitS_6SOm3REOtQ8KrNMXVilvTSY7maBTlOfelhCAXbGL/pub?output=csv";

async function loadAppsFromSheet() {
    try {
        const response = await fetch(SHEET_CSV_URL);
        const data = await response.text();
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
                isFeatured: (cols[7] || '').toUpperCase() === 'TRUE',
                kategori: (cols[8] || '').toLowerCase() // Ambil data kategori dari kolom I
            };
        });

        renderFeaturedApp(apps);
        
        // Render untuk halaman aplikasi.html (Kategori Administrasi)
        renderApps(apps, 'all-apps-container', 'administrasi');
        
        // Render untuk halaman pembelajaran.html (Kategori Pembelajaran)
        renderApps(apps, 'pembelajaran-apps-container', 'pembelajaran');

    } catch (error) {
        console.error("Gagal memuat data:", error);
    }
}

function renderGallery(gambarString) {
    if (!gambarString) return '';
    const images = gambarString.split(',').map(img => img.trim()).filter(img => img !== '');
    if (images.length === 1) {
        return `<div style="text-align: center; margin: 15px 0;"><img src="${images[0]}" class="app-image" style="max-width: 100%; border-radius: 8px;"></div>`;
    }
    return `<div class="gallery-grid">${images.map(img => `<img src="${img}" alt="Gambar">`).join('')}</div>`;
}

// Fungsi Render yang lebih fleksibel
function renderApps(apps, containerId, kategoriFilter) {
    const container = document.getElementById(containerId);
    if (!container) return;

    // Filter aplikasi berdasarkan kategori
    const filteredApps = apps.filter(app => app.kategori === kategoriFilter);

    if (filteredApps.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#777;">Belum ada aplikasi di kategori ini.</p>';
        return;
    }

    container.innerHTML = filteredApps.map(app => `
        <div class="app-card" style="margin-bottom: 25px;">
            <h3>${app.nama}</h3>
            <span class="badge">${app.badge}</span>
            ${renderGallery(app.gambar)}
            <p style="margin-top: 15px;">${app.deskripsi}</p>
            <div style="margin-top: 15px;">
                <a href="${app.linkDetail}" class="btn">Lihat Detail Fitur</a>
                <a href="${app.linkWa}" class="btn-wa" target="_blank">WhatsApp</a>
            </div>
        </div>
    `).join('');
}

function renderFeaturedApp(apps) {
    const container = document.getElementById('featured-app-container');
    if (!container) return;
    const featuredApp = apps.find(app => app.isFeatured) || apps[0];
    container.innerHTML = `
        <div class="app-card">
            <h3>${featuredApp.nama}</h3>
            <span class="badge">${featuredApp.badge}</span>
            ${renderGallery(featuredApp.gambar)}
            <p style="margin-top: 15px;">${featuredApp.deskripsi}</p>
            <a href="${featuredApp.linkDetail}" class="btn">Detail Selengkapnya</a>
        </div>
    `;
}

document.addEventListener("DOMContentLoaded", loadAppsFromSheet);
