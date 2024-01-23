document.addEventListener('DOMContentLoaded', function () {
    const youtubePlayer = document.getElementById('youtube-player');
    const speedControl = document.getElementById('speed');
    const speedDisplay = document.getElementById('speed-display');
    const resolutionSelect = document.getElementById('resolution-select');
    const videoSearchInput = document.getElementById('video-search');
    const videoListContainer = document.getElementById('video-list');
    const languageSelect = document.getElementById('language-select');

    let selectedVideoId = '';
    let currentLanguage = 'id';

    youtubePlayer.addEventListener('load', function () {
        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[1]}', '*');
    });

    speedControl.addEventListener('input', function () {
        const selectedSpeed = parseFloat(this.value).toFixed(2);
        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"setPlaybackRate","args":[' + selectedSpeed + ']}', '*');
        speedDisplay.textContent = selectedSpeed + 'x';
    });

    window.searchVideo = function () {
        const searchQuery = videoSearchInput.value.trim();
        if (searchQuery !== '') {
            searchYouTubeVideos(searchQuery);
        }
    };

    window.cancelSearch = function () {
        videoListContainer.innerHTML = '';
        if (selectedVideoId !== '') {
            const videoUrl = `https://www.youtube.com/embed/${selectedVideoId}?enablejsapi=1`;
            youtubePlayer.src = videoUrl;
            videoSearchInput.value = '';
        }
    };

    function searchYouTubeVideos(query) {
        const apiKey = 'AIzaSyD99rarquq7umxJZxbSBrI46H8o2rzx7mU';
        const apiUrl = `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&part=snippet&q=${encodeURIComponent(query)}&type=video`;

        fetch(apiUrl)
            .then(response => response.json())
            .then(data => displaySearchResults(data.items))
            .catch(error => console.error('Error fetching data:', error));
    }

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

        getSupportedResolutions(selectedVideoId);
    }

    function getSupportedResolutions(videoId) {
        const apiKey = 'YOUR_API_KEY';
        const resolutionsUrl = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&part=contentDetails&key=${apiKey}`;
        fetch(resolutionsUrl)
            .then(response => response.json())
            .then(data => {
                const videoDetails = data.items[0].contentDetails;
                const availableResolutions = videoDetails.videoQuality.split(',').map(resolution => resolution.trim());

                resolutionSelect.innerHTML = '';
                availableResolutions.forEach(resolution => {
                    const option = document.createElement('option');
                    option.value = resolution;
                    option.textContent = resolution;
                    resolutionSelect.appendChild(option);
                });
            })
            .catch(error => console.error('Error fetching resolutions:', error));
    }

    window.loadVideo = function (videoId, videoTitle) {
        selectedVideoId = videoId;
        const videoUrl = `https://www.youtube.com/embed/${videoId}?enablejsapi=1`;
        youtubePlayer.src = videoUrl;
        videoSearchInput.value = '';

        getSupportedResolutions(videoId);
    };

    resolutionSelect.addEventListener('change', function () {
        const selectedResolution = this.value;
        youtubePlayer.contentWindow.postMessage('{"event":"command","func":"setPlaybackQuality","args":["' + selectedResolution + '"]}', '*');
    });

    function initLanguageFunction() {
        updateLanguage();
    }

    function updateLanguage() {
        const elements = document.querySelectorAll('[data-lang]');

        elements.forEach(element => {
            const key = element.dataset.lang;
            element.textContent = languageData[key][currentLanguage];
        });
    }

    function changeLanguage(language) {
        currentLanguage = language;
        updateLanguage();
    }

    languageSelect.addEventListener('change', function () {
        changeLanguage(this.value);
    });

    initLanguageFunction();
});
