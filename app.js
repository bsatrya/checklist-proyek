// app.js - Logika Aplikasi Checklist Proyek

// Daftarkan Service Worker agar PWA bisa di-install dan offline
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker terdaftar:', reg.scope))
            .catch(err => console.log('Service Worker gagal terdaftar:', err));
    });
}

// URL Web App dari Google Apps Script (Nanti diisi setelah backend siap)
const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbws08KMXXIgimdzLoJJ6XR-qH-UmwqX4G_fJGNPjOr8EB0WaJKAQrVJhGNmA9cJjGTpnA/exec";

document.getElementById('saveBtn').addEventListener('click', async () => {
    const reportDate = document.getElementById('reportDate').value;
    const kavling = document.getElementById('kavlingSelect').value;
    const notes = document.getElementById('notes').value;

    if (!reportDate) {
        alert('Silakan pilih tanggal terlebih dahulu!');
        return;
    }

    // Kumpulkan status semua checkbox
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const taskData = {};
    
    checkboxes.forEach(cb => {
        const taskName = cb.getAttribute('data-task');
        taskData[taskName] = cb.checked; // true atau false
    });

    const payload = {
        date: reportDate,
        kavling: kavling,
        tasks: taskData,
        notes: notes
    };

    const saveBtn = document.getElementById('saveBtn');
    saveBtn.disabled = true;
    saveBtn.textContent = 'Menyimpan...';

    try {
        // Cek apakah online atau offline
        if (!navigator.onLine) {
            // Simpan ke LocalStorage jika offline
            let offlineQueue = JSON.parse(localStorage.getItem('offlineQueue') || '[]');
            offlineQueue.push(payload);
            localStorage.setItem('offlineQueue', JSON.stringify(offlineQueue));
            alert('Anda sedang offline. Data disimpan di perangkat dan akan disinkronkan saat ada internet.');
        } else {
            // Kirim ke Google Apps Script
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Diperlukan untuk Google Apps Script Web App
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            alert('Berhasil! Data checklist tersimpan ke Google Sheets.');
        }

        // Reset form checkbox setelah simpan
        checkboxes.forEach(cb => cb.checked = false);
        document.getElementById('notes').value = '';

    } catch (error) {
        console.error('Gagal mengirim data:', error);
        alert('Terjadi kesalahan saat menyimpan data.');
    } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Simpan & Kirim ke Google Sheets';
    }
});