// app.js - Logika Utama PWA Checklist Proyek

// 1. Dapatkan Service Worker untuk fitur PWA & Offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker terdaftar:', reg.scope))
            .catch(err => console.log('Service Worker gagal terdaftar:', err));
    });
}

// 2. URL Web App Google Apps Script Anda
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbykpnjT_fU6M9QnZRGljzq4hG4wFTS8RecUfCZ-vumgkZY5bfaRypZLZTgFsi3HOj_E7w/exec";

// 3. Logika Simpan & Kirim Data
document.getElementById('saveBtn').addEventListener('click', async () => {
    const reportDate = document.getElementById('reportDate').value;
    const kavling = document.getElementById('kavlingSelect').value;
    const lantai = document.getElementById('lantaiSelect').value;
    const notes = document.getElementById('notes').value;

    if (!reportDate) {
        alert('Silakan pilih tanggal terlebih dahulu!');
        return;
    }

    // Ambil status semua checkbox pekerjaan
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const taskData = {};
    let isAnyChecked = false;

    checkboxes.forEach(cb => {
        const taskName = cb.getAttribute('data-task');
        taskData[taskName] = cb.checked;
        if (cb.checked) isAnyChecked = true;
    });

    if (!isAnyChecked && !notes.trim()) {
        alert('Pilih setidaknya satu pekerjaan atau isi catatan sebelum menyimpan!');
        return;
    }

    // Paket data yang dikirim
    const payload = {
        date: reportDate,
        kavling: kavling,
        lantai: lantai,
        tasks: taskData,
        notes: notes
    };

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan...';

    try {
        // Cek koneksi internet
        if (!navigator.onLine) {
            // Jika offline, simpan sementara di browser (LocalStorage)
            let offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
            offlineQueue.push(payload);
            localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
            alert('Koneksi internet tidak ada. Data disimpan di HP dan akan tersinkronkan nanti.');
        } else {
            // Kirim data ke Google Apps Script
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Mencegah kendala CORS pada Google Apps Script Web App
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert(`Berhasil! Data checklist ${kavling} (${lantai}) tersimpan ke Google Sheets.`);
        }

        // Reset form checkbox dan catatan setelah berhasil simpan
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById('notes').value = '';

    } catch (error) {
        console.error('Gagal mengirim data:', error);
        alert('Terjadi kesalahan saat menyimpan data ke server.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Simpan & Kirim ke Google Sheets';
    }
});