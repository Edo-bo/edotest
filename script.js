const API_KEY = 'AIzaSyAz9RUvyfxShFMtneqwtSIY0xCQ9VsqYck';

const searchButton = document.getElementById('searchButton');
const searchInput = document.getElementById('searchInput');
const resultsContainer = document.getElementById('results');
let player;

// Fungsi ini dipanggil oleh API YouTube IFrame setelah script-nya siap
function onYouTubeIframeAPIReady() {
    console.log("YouTube API Siap.");
}

// Fungsi untuk membuat dan mengontrol player
function createPlayer(videoId) {
    if (player) {
        player.destroy();
    }
    player = new YT.Player('player-container', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
            'playsinline': 1,
            'autoplay': 1 // Otomatis putar video saat dimuat
        },
        events: {
            'onReady': onPlayerReady
        }
    });
}

function onPlayerReady(event) {
    event.target.playVideo();
}


// Fungsi untuk mencari video
async function searchMusic() {
    const query = searchInput.value;
    if (!query) {
        alert('Silakan masukkan judul lagu atau artis!');
        return;
    }

    // Tampilkan loading (opsional)
    resultsContainer.innerHTML = '<p>Mencari...</p>';

    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${API_KEY}&type=video&maxResults=10`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            // Cek jika error karena API Key tidak valid
            if (response.status === 400 || response.status === 403) {
                throw new Error('API Key tidak valid atau salah. Silakan periksa kembali.');
            }
            throw new Error(`Terjadi error: ${response.statusText}`);
        }
        const data = await response.json();
        displayResults(data.items);
    } catch (error) {
        resultsContainer.innerHTML = `<p style="color: red;">Gagal memuat hasil: ${error.message}</p>`;
        console.error('Error fetching data:', error);
    }
}

// Fungsi untuk menampilkan hasil pencarian
function displayResults(items) {
    resultsContainer.innerHTML = ''; // Bersihkan hasil sebelumnya

    if (items.length === 0) {
        resultsContainer.innerHTML = '<p>Tidak ada hasil yang ditemukan.</p>';
        return;
    }

    items.forEach(item => {
        const videoId = item.id.videoId;
        const title = item.snippet.title;
        const channelTitle = item.snippet.channelTitle;
        const thumbnailUrl = item.snippet.thumbnails.default.url;

        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';

        resultItem.innerHTML = `
            <img src="${thumbnailUrl}" alt="${title}">
            <div class="info">
                <div class="title">${title}</div>
                <div class="channel">${channelTitle}</div>
            </div>
            <div class="actions">
                <button class="download-btn" data-id="${videoId}" data-format="mp3">Download MP3</button>
                <button class="download-btn" data-id="${videoId}" data-format="mp4">Download MP4</button>
            </div>
        `;
        
        // Event listener untuk memutar video saat item diklik
        resultItem.querySelector('.info').addEventListener('click', () => {
            createPlayer(videoId);
        });

        resultsContainer.appendChild(resultItem);
    });
    
    // Tambahkan event listener untuk semua tombol download
    document.querySelectorAll('.download-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Mencegah pemutaran video saat tombol download diklik
            const id = e.target.dataset.id;
            const format = e.target.dataset.format;
            handleDownload(id, format);
        });
    });
}

// **Fungsi Konseptual untuk Download**
function handleDownload(videoId, format) {
    console.log(`Memulai permintaan download untuk video ID: ${videoId} dengan format: ${format}`);
    
    // INI ADALAH CONTOH, BUKAN API NYATA
    // Anda harus mencari layanan API downloader dan mengganti URL ini.
    // Contoh: const downloadApiUrl = `https://api.downloader-xyz.com/download?id=${videoId}&format=${format}`;
    
    alert(`Fitur download ini hanya contoh.\nUntuk mengimplementasikannya, Anda perlu menemukan API downloader pihak ketiga dan memanggilnya di sini dengan Video ID: ${videoId} dan format: ${format}.`);

    // Jika Anda punya API yang berfungsi, Anda bisa melakukan ini:
    // window.open(downloadApiUrl, '_blank');
}


// Tambahkan event listener ke tombol cari
searchButton.addEventListener('click', searchMusic);

// Izinkan pencarian dengan menekan tombol Enter
searchInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        searchMusic();
    }
});
