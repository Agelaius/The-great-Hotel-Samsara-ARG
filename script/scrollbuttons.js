document.addEventListener('DOMContentLoaded', function() {
    const scrollUpButton = document.querySelector('.scroll-button.scroll-up');
    const scrollDownButton = document.querySelector('.scroll-button.scroll-down');
    const sidebarContent = document.querySelector('.sidebar');

    let scrollInterval;
    const scrollSpeed = 5;

    function startScrolling(direction) {
        scrollInterval = setInterval(() => {
            if (direction === 'up') {
                sidebarContent.scrollBy({ top: -scrollSpeed, behavior: 'auto' });
            } else if (direction === 'down') {
                sidebarContent.scrollBy({ top: scrollSpeed, behavior: 'auto' });
            }
        }, 10);
    }

    function stopScrolling() {
        clearInterval(scrollInterval);
    }

    // Mouse events
    scrollUpButton.addEventListener('mousedown', () => {
        startScrolling('up');
    });

    scrollDownButton.addEventListener('mousedown', () => {
        startScrolling('down');
    });

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

    function checkOverflow() {
        if (sidebarContent.scrollHeight > sidebarContent.clientHeight) {
            scrollUpButton.classList.remove('hidden');    // Remove 'hidden' to make visible
            scrollDownButton.classList.remove('hidden');
        } else {
            scrollUpButton.classList.add('hidden');       // Add 'hidden' to hide
            scrollDownButton.classList.add('hidden');
        }
    }

    // Debounce function to limit how often checkOverflow is called
    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    // Get all the <details> elements within the sidebar
    const detailsElements = document.querySelectorAll('.sidebar details');

    // Attach an event listener to each <details> element
    detailsElements.forEach(detailsElement => {
        detailsElement.addEventListener('toggle', debounce(checkOverflow, 50)); // Debounce to 50ms
    });

    // Initial check on page load
    checkOverflow();

    // Optional: Check on window resize
    window.addEventListener('resize', checkOverflow);

    // Optional: Implement MutationObserver only if absolutely necessary for other dynamic content changes
    // and carefully configure it to avoid infinite loops. If so, target only the specific dynamic elements.
});
