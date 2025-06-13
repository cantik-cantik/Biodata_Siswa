 document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('registrationForm');
    const formContainer = document.getElementById('formContainer');
    const dataContainer = document.getElementById('dataContainer');
    const photoInput = document.getElementById('photo');
    const photoPreview = document.getElementById('photoPreview');
    const dataPhoto = document.getElementById('dataPhoto');
    const progressBar = document.getElementById('progressBar');
           

    
            // Fungsi untuk menampilkan preview foto
            if (photoInput && photoPreview) {
                photoInput.addEventListener('change', function () {
                    const file = this.files[0];
                    if (file) {
                        // Validasi ukuran file (max 2MB)
                        if (file.size > 2 * 1024 * 1024) {
                            Swal.fire({
                                title: 'Error!',
                                text: 'Ukuran foto maksimal 2MB',
                                icon: 'error'
                            });
                            this.value = '';
                            return;
                        }

                        const reader = new FileReader();

                        reader.addEventListener('load', function () {
                            photoPreview.style.display = 'block';
                            photoPreview.src = this.result;
                            dataPhoto.src = this.result;
                            if (photoPreview.nextElementSibling) {
                                photoPreview.nextElementSibling.style.display = 'none';
                            }
                        });

                        reader.readAsDataURL(file);
                    }
                });
            }

            form.addEventListener('submit', function (e) {
                e.preventDefault();
                let filled = 0;

                // Reset error states
                const errorMessages = document.querySelectorAll('.error-message');
                errorMessages.forEach(msg => {
                    msg.style.display = 'none';
                });

                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    input.classList.remove('error');
                });

                // Validate form
                const requiredInputs = form.querySelectorAll('[required]');
                let isValid = true;
                const latitude = document.getElementById('latitude').value;
                const longitude = document.getElementById('longitude').value;

                if (!latitude || !longitude) {
                    Swal.fire({
                        title: 'Peringatan!',
                        text: 'Silakan tentukan lokasi rumah di peta',
                        icon: 'warning'
                    });
                    return;

                    // Scroll ke peta
                    document.getElementById('map').scrollIntoView({
                        behavior: 'smooth',
                        block: 'center'
                    });
                }
                requiredInputs.forEach(input => {
                    if (!input.value.trim()) {
                        input.classList.add('error');
                        const errorId = input.id + '_error';
                        const errorElement = document.getElementById(errorId);
                        if (errorElement) {
                            errorElement.style.display = 'block';
                        }
                        isValid = false;
                    } else {
                        filled++;
                    }
                });

                // Update progress bar jika ada
                if (progressBar) {
                    progressBar.style.width = `${(filled / requiredInputs.length) * 100}%`;
                }

                // Validasi khusus untuk foto
                if (!photoInput.files || photoInput.files.length === 0) {
                    photoInput.classList.add('error');
                    isValid = false;
                }

                if (isValid) {
                    // Jika form valid, tampilkan data hasil
                    showDataResult();
                } else {
                    // Jika form tidak valid
                    const firstError = form.querySelector('.error');
                    if (firstError) {
                        firstError.scrollIntoView({
                            behavior: 'smooth',
                            block: 'center'
                        });
                    }
                }
            });

            // Fungsi untuk menampilkan data hasil
            function showDataResult() {
                // Format tempat tanggal lahir
                const tanggalLahir = new Date(document.getElementById('tanggal_lahir').value);
                const options = { day: 'numeric', month: 'long', year: 'numeric' };
                const formattedDate = tanggalLahir.toLocaleDateString('id-ID', options);

                // Isi data hasil
                document.getElementById('dataNamaLengkap').textContent = document.getElementById('nama_lengkap').value;
                document.getElementById('dataNamaPanggilan').textContent = document.getElementById('nama_panggilan').value;
                document.getElementById('dataAgama').textContent = document.getElementById('agama').value;

                document.getElementById('dataTtl').textContent = `${document.getElementById('tempat_lahir').value}, ${formattedDate}`;

                document.getElementById('dataAnakKe').textContent = document.getElementById('anak_ke').value;
                document.getElementById('dataJumlahSaudara').textContent = document.getElementById('jumlah_saudara').value;
                document.getElementById('dataNoHp').textContent = document.getElementById('no_hp').value;
                document.getElementById('dataNoInduk').textContent = document.getElementById('no_induk').value;
                document.getElementById('dataNisn').textContent = document.getElementById('nisn').value;
                document.getElementById('dataKelas').textContent = document.getElementById('kelas').value;
                document.getElementById('dataJurusan').textContent = document.getElementById('jurusan').value;
                document.getElementById('dataNamaAyah').textContent = document.getElementById('nama_ayah').value;
                document.getElementById('dataPekerjaanAyah').textContent = document.getElementById('pekerjaan_ayah').value;
                document.getElementById('dataPendidikanAyah').textContent = document.getElementById('pendidikan_ayah').value;
                document.getElementById('dataNamaIbu').textContent = document.getElementById('nama_ibu').value;
                document.getElementById('dataPekerjaanIbu').textContent = document.getElementById('pekerjaan_ibu').value;
                document.getElementById('dataPendidikanIbu').textContent = document.getElementById('pendidikan_ibu').value;
                // document.getElementById('dataKecamatan').textContent = document.getElementById('kecamatan').value;
                // document.getElementById('dataDesa').textContent = document.getElementById('desa').value;

                // Format alamat lengkap
                const alamat = `${document.getElementById('jalan').value}, RT ${document.getElementById('rt').value}/RW ${document.getElementById('rw').value}, ${document.getElementById('desa').value}, ${document.getElementById('kecamatan').value}`;
                document.getElementById('dataAlamat').textContent = alamat;

                // Sembunyikan form dan tampilkan data hasil
                formContainer.style.display = 'none';
                document.querySelector('.form-footer').style.display = 'none';
                document.querySelector('.progress-container').style.display = 'none';
                dataContainer.style.display = 'block';

                // Scroll ke data hasil
                dataContainer.scrollIntoView({ behavior: 'smooth' });

                // Tambahkan ke fungsi showDataResult() untuk menampilkan lokasi di data hasil
        const dataAlamatSection = document.querySelector('.data-section:last-child');
        dataAlamatSection.innerHTML += `
    <div class="data-row">
        <div class="data-label">Koordinat Lokasi:</div>
        <div class="data-value" id="dataKoordinat"></div>
    </div>
    <div class="data-row">
        <div class="data-label">Peta Lokasi:</div>
        <div class="data-value">
            <div id="dataMap" style="height: 200px; width: 80%; border: 1px solid #ddd; border-radius: 5px;"></div>
        </div>
    </div>
`;

        // Tambahkan di akhir fungsi showDataResult()
        const latitude = document.getElementById('latitude').value || -8.3056;
        const longitude = document.getElementById('longitude').value || 114.2811;
        document.getElementById('dataKoordinat').textContent = `${latitude}, ${longitude}`;

        // Tampilkan peta di data hasil
        setTimeout(() => {
            const dataMap = L.map('dataMap').setView([latitude, longitude], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(dataMap);

            L.marker([latitude, longitude]).addTo(dataMap)
                .bindPopup("<b>Lokasi Rumah</b>")
                .openPopup();
        }, 100);
            }

            // Fungsi untuk kembali ke form
            window.backToForm = function () {
                formContainer.style.display = 'flex';
                document.querySelector('.form-footer').style.display = 'block';
                document.querySelector('.progress-container').style.display = 'block';
                dataContainer.style.display = 'none';

                // Scroll ke form
                formContainer.scrollIntoView({ behavior: 'smooth' });
            }

            // Highlight required fields on focus
            const requiredFields = form.querySelectorAll('[required]');
            requiredFields.forEach(field => {
                field.addEventListener('focus', function () {
                    this.classList.remove('error');
                    const errorId = this.id + '_error';
                    const errorElement = document.getElementById(errorId);
                    if (errorElement) {
                        errorElement.style.display = 'none';
                    }
                });
            });
        });
        // Tambahkan setelah semua kode JavaScript yang ada

        // Load Leaflet CSS dan JS (tambahkan di head jika belum ada)
        const leafletCSS = document.createElement('link');
        leafletCSS.rel = 'stylesheet';
        leafletCSS.href = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css';
        document.head.appendChild(leafletCSS);

        const leafletJS = document.createElement('script');
        leafletJS.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
        leafletJS.onload = function () {
            initializeMap();
            initializeResultMap();
        };
        document.head.appendChild(leafletJS);
        function initializeMap() {
            // Default koordinat (contoh: SMK Muhammadiyah 6 Rogojampi)
            const defaultLat = -8.3056;
            const defaultLng = 114.2811;

            // Inisialisasi peta
            const map = L.map('map').setView([defaultLat, defaultLng], 15);

            // Tambahkan tile layer (OpenStreetMap)
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Tambahkan marker dengan drag and drop
            const marker = L.marker([defaultLat, defaultLng], {
                draggable: true
            }).addTo(map)
                .bindPopup("<b>Lokasi Rumah</b><br>Geser pin ke lokasi yang tepat")
                .openPopup();

            // Tambahkan custom icon untuk marker
            marker.setIcon(
                L.divIcon({
                    html: '<i class="fas fa-home" style="color: #db8d34; font-size: 24px;"></i>',
                    iconSize: [24, 24],
                    className: 'map-marker-label'
                })
            );

            // Update koordinat saat marker digeser
            marker.on('dragend', function (event) {
                const position = marker.getLatLng();
                document.getElementById('latitude').value = position.lat;
                document.getElementById('longitude').value = position.lng;
            });

            // Tambahkan event untuk klik peta
            map.on('click', function (e) {
                marker.setLatLng(e.latlng);
                document.getElementById('latitude').value = e.latlng.lat;
                document.getElementById('longitude').value = e.latlng.lng;
            });

            // Coba dapatkan lokasi pengguna
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function (position) {
                    const userLat = position.coords.latitude;
                    const userLng = position.coords.longitude;

                    // Update marker position
                    marker.setLatLng([userLat, userLng]);
                    map.setView([userLat, userLng], 15);

                    // Update hidden inputs
                    document.getElementById('latitude').value = userLat;
                    document.getElementById('longitude').value = userLng;
                }, function (error) {
                    console.error("Error getting location: ", error);
                });
            }
        }