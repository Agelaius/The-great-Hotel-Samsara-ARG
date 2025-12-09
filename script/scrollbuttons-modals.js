function initializeScrollButtons(modal) {
    const textContainer = modal.querySelector('.text-wrapper');
    if (!textContainer) return; // Only for text modals

    const scrollUpButton = modal.querySelector('.scroll-button.scroll-up');
    const scrollDownButton = modal.querySelector('.scroll-button.scroll-down');

    // If buttons don't exist, do nothing (prevents null addEventListener error)
    if (!scrollUpButton || !scrollDownButton) {
        return;
    }

    let scrollInterval;
    const scrollSpeed = 5;

    function startScrolling(direction) {
        stopScrolling(); // clear existing interval first
        scrollInterval = setInterval(() => {
            if (direction === 'up') {
                textContainer.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
            } else if (direction === 'down') {
                textContainer.scrollBy({ top: scrollSpeed, behavior: 'auto' });
            }
        }, 10);
    }

    function stopScrolling() {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }
    }

    // Mouse events
    scrollUpButton.addEventListener('mousedown', () => startScrolling('up'));
    scrollDownButton.addEventListener('mousedown', () => startScrolling('down'));

    scrollUpButton.addEventListener('mouseup', stopScrolling);
    scrollUpButton.addEventListener('mouseleave', stopScrolling);
    scrollDownButton.addEventListener('mouseup', stopScrolling);
    scrollDownButton.addEventListener('mouseleave', stopScrolling);

    // Touch events
    scrollUpButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startScrolling('up');
    }, { passive: false });

    scrollDownButton.addEventListener('touchstart', (event) => {
        event.preventDefault();
        startScrolling('down');
    }, { passive: false });

    scrollUpButton.addEventListener('touchend', stopScrolling);
    scrollUpButton.addEventListener('touchcancel', stopScrolling);
    scrollDownButton.addEventListener('touchend', stopScrolling);
    scrollDownButton.addEventListener('touchcancel', stopScrolling);

    // Show/hide buttons based on overflow
    function checkOverflow() {
        if (!textContainer) return;

        if (textContainer.scrollHeight > textContainer.clientHeight) {
            scrollUpButton.classList.remove('hidden');
            scrollDownButton.classList.remove('hidden');
        } else {
            scrollUpButton.classList.add('hidden');
            scrollDownButton.classList.add('hidden');
        }
    }

    // Run once after layout
    checkOverflow();

    // Optional: re-check on window resize in case modal size changes
    window.addEventListener('resize', checkOverflow);
}
