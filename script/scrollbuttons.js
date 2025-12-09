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
            scrollUpButton.classList.remove('hidden');
            scrollDownButton.classList.remove('hidden');
        } else {
            scrollUpButton.classList.add('hidden');
            scrollDownButton.classList.add('hidden');
        }
    }

    function debounce(func, delay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    const detailsElements = document.querySelectorAll('.sidebar details');

    detailsElements.forEach(detailsElement => {
        detailsElement.addEventListener('toggle', debounce(checkOverflow, 50));
    });

    checkOverflow();

    window.addEventListener('resize', checkOverflow);

});
