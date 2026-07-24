function loadComments(appId) {
    const listContainer = document.getElementById('list-' + appId);
    if (!listContainer) return;

    const savedComments = JSON.parse(localStorage.getItem('comments_' + appId) || '[]');
    
    savedComments.forEach(c => {
        const item = document.createElement('div');
        item.className = 'comment-item';
        item.innerHTML = `<div class="comment-header">${c.name} <span class="comment-time">${c.time}</span></div><div>${c.text}</div>`;
        listContainer.appendChild(item);
    });
}

function addComment(appId) {
    const nameInput = document.getElementById('name-' + appId);
    const textInput = document.getElementById('text-' + appId);
    
    const name = nameInput.value.trim();
    const text = textInput.value.trim();
    
    if(!name || !text) {
        alert("Harap isi nama dan komentar Anda terlebih dahulu!");
        return;
    }

    const time = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    
    const newComment = { name, text, time };
    
    // Simpan ke localStorage
    const savedComments = JSON.parse(localStorage.getItem('comments_' + appId) || '[]');
    savedComments.push(newComment);
    localStorage.setItem('comments_' + appId, JSON.stringify(savedComments));
    
    // Tampilkan di layar
    const listContainer = document.getElementById('list-' + appId);
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<div class="comment-header">${name} <span class="comment-time">${time}</span></div><div>${text}</div>`;
    listContainer.appendChild(item);
    
    // Bersihkan input
    nameInput.value = '';
    textInput.value = '';
}

// Muat komentar saat halaman dibuka
window.onload = function() {
    ['absen', 'sipaguru', 'digarsip', 'sihebat', 'smartbel'].forEach(appId => loadComments(appId));
};
