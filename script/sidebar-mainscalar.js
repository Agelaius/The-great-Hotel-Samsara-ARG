document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const antiSidebar = document.getElementById('anti-sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');
    const toggleButton2 = document.getElementById('sidebar-toggle2');

    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        antiSidebar.classList.toggle('collapsed');
        requestAdjust();
    });

    if (toggleButton2) {
        toggleButton2.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            antiSidebar.classList.toggle('collapsed');
            requestAdjust();
        });
    }

    sidebar.addEventListener('transitionend', () => {
        if (sidebar.classList.contains('collapsed')) {
            sidebar.style.overflow = 'hidden';
        } else {
            sidebar.style.overflow = 'scroll';
        }
    });

    const mainElement = document.querySelector('.main');
    const flexWrapper = document.getElementById('flex-wrapper');

    let pending = false;

    const requestAdjust = () => {
        if (!pending) {
            pending = true;
            requestAnimationFrame(() => {
                adjustLayout();
                pending = false;
            });
        }
    };

    const adjustLayout = () => {
        const windowWidth = window.innerWidth;
        const originalMainWidth = 800;
        const marginSize = 10;

        if (!mainElement || !flexWrapper) {
            console.error("Main element or flex wrapper not found.");
            return;
        }

        const scrollY = window.scrollY;
        const initialDocumentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;
        const initialScrollPercentage =
            scrollY / initialDocumentHeight;

        let scaleFactor = (windowWidth - 2 * marginSize) / originalMainWidth;
        if (windowWidth <= 2 * marginSize) {
            scaleFactor = 0.01;
        }

        let newMainWidth = originalMainWidth * scaleFactor;
        let marginOffset = (windowWidth - newMainWidth) / 2;

        if (windowWidth < originalMainWidth) {
            mainElement.style.transformOrigin = 'top center';
            mainElement.style.transform = `scale(${scaleFactor})`;
            mainElement.style.width = `${originalMainWidth}px`;

            flexWrapper.style.marginLeft = `${marginOffset}px`;
            flexWrapper.style.marginRight = `${marginOffset}px`;

            const scaledHeight = mainElement.offsetHeight * scaleFactor;
            flexWrapper.style.height = `${scaledHeight}px`;
        } else {
            mainElement.style.transform = 'scale(1)';
            mainElement.style.width = '';
            flexWrapper.style.height = '';
            flexWrapper.style.marginLeft = '';
            flexWrapper.style.marginRight = '';
        }

        const newDocumentHeight =
            document.documentElement.scrollHeight -
            document.documentElement.clientHeight;

        const newScrollPosition =
            newDocumentHeight * initialScrollPercentage;

        window.scrollTo(0, newScrollPosition);
    };

    const observer = new MutationObserver(requestAdjust);

    const config = {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true
    };

    observer.observe(mainElement, config);

    requestAdjust();
    window.addEventListener('resize', requestAdjust);
});
