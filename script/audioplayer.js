document.addEventListener('DOMContentLoaded', function() {
    const players = document.querySelectorAll('.audio-player');

    players.forEach(player => {
        const audioSrc = player.dataset.audioSrc;
        const audioTitle = player.dataset.audioTitle;
        const titleElement = player.querySelector('.audio-title');
        const progressBarContainer = player.querySelector('.progress-bar-container');
        const progressBar = player.querySelector('.progress-bar');
        const progressKnob = player.querySelector('.progress-knob');
        const playPauseButton = player.querySelector('.play-pause-button');
        const volumeSlider = player.querySelector('.volume-slider');
        const currentTimeDisplay = player.querySelector('.current-time');
        const totalTimeDisplay = player.querySelector('.total-time');

        const audio = new Audio(audioSrc);

        titleElement.textContent = audioTitle;

        let isPlaying = false;
        let animationFrameId;
        let isDragging = false;

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        }

        function updateProgressBar() {
            const percentage = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${percentage}%`;

            const progressBarWidth = progressBarContainer.offsetWidth;
            const knobPosition = (percentage / 100) * progressBarWidth;
            progressKnob.style.left = `${knobPosition - (progressKnob.offsetWidth / 2)}px`;


            currentTimeDisplay.textContent = formatTime(audio.currentTime);

            if (isPlaying) {
                animationFrameId = requestAnimationFrame(updateProgressBar);
            }
        }

        playPauseButton.addEventListener('click', function() {
            isPlaying = !isPlaying;

            if (isPlaying) {
                audio.play();
                playPauseButton.textContent = '❚❚';
                updateProgressBar();
            } else {
                audio.pause();
                playPauseButton.textContent = '▶';
                cancelAnimationFrame(animationFrameId);
            }
        });

       volumeSlider.addEventListener('input', function() {
           const volume = parseFloat(this.value);
           audio.volume = volume * volume;
       });

        audio.addEventListener('loadedmetadata', function() {
            const duration = audio.duration;
            totalTimeDisplay.textContent = formatTime(duration);
        });

        audio.addEventListener('timeupdate', function() {
            currentTimeDisplay.textContent = formatTime(audio.currentTime);
        });

        function seekTo(event) {
            const rect = progressBarContainer.getBoundingClientRect();
            const clickPosition = event.clientX - rect.left;
            const percentage = clickPosition / rect.width;
            const newTime = audio.duration * percentage;
            audio.currentTime = newTime;
            updateProgressBar();
        }

        progressBarContainer.addEventListener('mousedown', function(e) {
            isDragging = true;
            seekTo(e);
        });

        progressBarContainer.addEventListener('mousemove', function(e) {
            if (isDragging) {
                seekTo(e);
            }
        });

        progressBarContainer.addEventListener('mouseup', function(e) {
            isDragging = false;
        });

        progressBarContainer.addEventListener('mouseleave', function(e) {
            isDragging = false;
        });

        audio.addEventListener('ended', function() {
            playPauseButton.textContent = '▶';
            isPlaying = false;
            cancelAnimationFrame(animationFrameId);
            audio.currentTime = 0;
            progressBar.style.width = '0%';
            progressKnob.style.left = '-2px';
            currentTimeDisplay.textContent = '0:00';
        });
    });
});