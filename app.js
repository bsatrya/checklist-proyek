const reportDate = document.getElementById('reportDate').value;
    const kavling = document.getElementById('kavlingSelect').value;
    const lantai = document.getElementById('lantaiSelect').value; // <-- Tambahan variabel lantai
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
        taskData[taskName] = cb.checked;
    });

    const payload = {
        date: reportDate,
        kavling: kavling,
        lantai: lantai, // <-- Disertakan dalam data yang dikirim
        tasks: taskData,
        notes: notes
    };