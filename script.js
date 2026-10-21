// 1. Pilih elemen foto profil, modal, dan tombol sapa
const fotoProfil = document.getElementById('fotoProfil');
const modalFoto = document.getElementById('modalFoto');
const tombolSapa = document.getElementById('sapaButton');

// 2. Buka modal popup foto ala WhatsApp ketika foto profil diklik
if (fotoProfil && modalFoto) {
    fotoProfil.addEventListener('click', function() {
        modalFoto.classList.add('aktif');
    });

    // Tutup kembali ketika area modal / foto diklik
    modalFoto.addEventListener('click', function() {
        modalFoto.classList.remove('aktif');
    });
}

// 3. Klik tombol sapa untuk menampilkan pesan sapaan
if (tombolSapa) {
    tombolSapa.addEventListener('click', function() {
        alert('Halo! Salam kenal, saya Rizky Fahmi 👋');
    });
}
