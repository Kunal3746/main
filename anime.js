//Floating Music Player
window.addEventListener('DOMContentLoaded', function() {
    // List of available tracks
    const tracks = [
        {
            title: 'Katawaredoki',
            file: 'music/Katawaredoki.mp3'
        },
        {
            title: 'Lofi Heartbeat - Lofi Bossa',
            file: 'music/Lofi Heartbeat - Lofi Bossa [Thematic].mp3'
        }
        
        // Add more tracks here as needed
    ];

    // Create right edge hover zone
    const hoverZone = document.createElement('div');
    hoverZone.className = 'right-hover-zone';
    document.body.appendChild(hoverZone);

    // Create player container
    const player = document.createElement('div');
    player.className = 'floating-music-player';
    player.innerHTML = `
        <div class="music-player-header">
            <button id="music-list-toggle" class="music-list-btn" title="Choose music">
                <span class="material-symbols-outlined">🎵</span>
            </button>
        </div>
        <audio id="audio-player" src="${tracks[0].file}"></audio>
        <button id="music-toggle" class="music-btn">
            <span id="music-icon">▶️</span>
        </button>
        <span class="music-title">${tracks[0].title}</span>
        <div class="music-list-card" id="music-list-card" style="display:none;"></div>
    `;
    document.body.appendChild(player);

    const audio = player.querySelector('#audio-player');
    const toggle = player.querySelector('#music-toggle');
    const icon = player.querySelector('#music-icon');
    const musicTitle = player.querySelector('.music-title');
    const musicListBtn = player.querySelector('#music-list-toggle');
    const musicListCard = player.querySelector('#music-list-card');

    let playing = false;
    let hideTimeout = null;
    let userPrompted = false;

    // Music list card logic
    function renderMusicList() {
        musicListCard.innerHTML = `<div class='music-list-title'>Choose a track</div>` + tracks.map((track, i) =>
            `<div class='music-list-item' data-index='${i}'>${track.title}</div>`
        ).join('');
    }
    renderMusicList();

    musicListBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        musicListCard.style.display = musicListCard.style.display === 'block' ? 'none' : 'block';
        if (musicListCard.style.display === 'block') {
            // Keep player visible while choosing
            player.classList.add('show');
            if (hideTimeout) clearTimeout(hideTimeout);
        } else if (!userPrompted) {
            // Start auto-hide timer when closing
            hideTimeout = setTimeout(() => {
                player.classList.remove('show');
            }, 2000);
        }
    });
    // Hide card when clicking outside
    document.addEventListener('click', function(e) {
        if (!musicListCard.contains(e.target) && e.target !== musicListBtn) {
            if (musicListCard.style.display === 'block') {
                musicListCard.style.display = 'none';
                if (!userPrompted) {
                    hideTimeout = setTimeout(() => {
                        player.classList.remove('show');
                    }, 2000);
                }
            }
        }
    });
    // Track selection
    musicListCard.addEventListener('click', function(e) {
        const item = e.target.closest('.music-list-item');
        if (item) {
            const idx = parseInt(item.getAttribute('data-index'));
            audio.src = tracks[idx].file;
            musicTitle.textContent = tracks[idx].title;
            audio.play();
            icon.textContent = '⏸️';
            playing = true;
            musicListCard.style.display = 'none';
            if (!userPrompted) {
                hideTimeout = setTimeout(() => {
                    player.classList.remove('show');
                }, 2000);
            }
        }
    });

    function showPlayer(permanent = false) {
        player.classList.add('show');
        if (hideTimeout) clearTimeout(hideTimeout);
        if (!permanent) {
            hideTimeout = setTimeout(() => {
                player.classList.remove('show');
            }, 2000);
        }
    }

    hoverZone.addEventListener('mouseenter', () => showPlayer());
    player.addEventListener('mouseenter', function() {
        if (hideTimeout) clearTimeout(hideTimeout);
    });
    player.addEventListener('mouseleave', function() {
        if (!userPrompted) {
            hideTimeout = setTimeout(() => {
                player.classList.remove('show');
            }, 2000);
        }
    });

    toggle.addEventListener('click', function() {
        if (playing) {
            audio.pause();
            icon.textContent = '▶️';
        } else {
            audio.play();
            icon.textContent = '⏸️';
        }
        playing = !playing;
        if (userPrompted) {
            userPrompted = false;
            hideTimeout = setTimeout(() => {
                player.classList.remove('show');
            }, 2000);
        }
    });

    // Autoplay on page load
    audio.play().then(() => {
        icon.textContent = '⏸️';
        playing = true;
    }).catch((e) => {
        icon.textContent = '▶️';
        playing = false;
        userPrompted = true;
        showPlayer(true);
        toggle.classList.add('autoplay-prompt');
    });
});