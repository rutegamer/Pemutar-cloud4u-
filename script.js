// script.js
document.addEventListener('DOMContentLoaded', function () {
    const youtubePlayer = document.getElementById('youtube-player');
    const speedControl = document.getElementById('speed');
    const speedDisplay = document.getElementById('speed-display');
    const videoSearchInput = document.getElementById('video-search');
    const videoListContainer = document.getElementById('video-list');

    let selectedVideoId = ''; // Menyimpan ID video yang dipilih sebelumnya

    youtubePlayer.addEventListener('load', function () {
        // Mengatur kecepatan awal
        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[1]}', '*');
    });

    // Kontrol kecepatan
    speedControl.addEventListener('input', function () {
        const selectedSpeed = parseFloat(this.value).toFixed(2);
        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[' + selectedSpeed + ']}', '*');
        speedDisplay.textContent = selectedSpeed + 'x';
    });

    // Fungsi pencarian video
    window.searchVideo = function () {
        const searchQuery = videoSearchInput.value.trim();
        if (searchQuery !== '') {
            searchYouTubeVideos(searchQuery);
        }
    };

    // Fungsi untuk membatalkan pencarian dan memuat kembali video yang telah dipilih
    window.cancelSearch = function () {
        videoListContainer.innerHTML = ''; // Mengosongkan daftar hasil pencarian
        if (selectedVideoId !== '') {
            // Memuat kembali video yang telah dipilih sebelumnya
            const videoUrl = `https://www.youtube.com/embed/${selectedVideoId}?enablejsapi=1`;
            youtubePlayer.src = videoUrl;
            videoSearchInput.value = ''; // Mengosongkan input pencarian
        }
    };

    // Fungsi untuk mencari video di YouTube Data API
    function searchYouTubeVideos(query) {
        // Ganti 'YOUR_API_KEY' dengan kunci API YouTube Anda
        const apiKey = 'AIzaSyD99rarquq7umxJZxbSBrI46H8o2rzx7mU';
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${encodeURIComponent(query)}&type=video`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displaySearchResults(data.items))
            .catch(error => console.error('Error fetching data:', error));
    }

    // Fungsi untuk menampilkan hasil pencarian dalam daftar
    function displaySearchResults(items) {
        videoListContainer.innerHTML = '';

        items.forEach(item => {
            const videoId = item.id.videoId;
            const videoTitle = item.snippet.title;
            const thumbnailUrl = item.snippet.thumbnails.medium.url;

            const videoItem = document.createElement('div');
            videoItem.className = 'video-item';
            videoItem.innerHTML = `
                <img src="${thumbnailUrl}" alt="${videoTitle}" onclick="loadVideo('${videoId}', '${videoTitle}')">
                <p>${videoTitle}</p>
            `;

            videoListContainer.appendChild(videoItem);
        });
    }

    // Fungsi untuk memuat video ke pemutar utama
    window.loadVideo = function (videoId, videoTitle) {
        selectedVideoId = videoId; // Menyimpan ID video yang dipilih sebelumnya
        const videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        youtubePlayer.src = videoUrl;
        videoSearchInput.value = ''; // Mengosongkan input pencarian setelah memilih video
    };
});
