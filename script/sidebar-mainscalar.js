document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('.sidebar');
    const antiSidebar = document.getElementById('anti-sidebar');
    const toggleButton = document.getElementById('sidebar-toggle');
    const toggleButton2 = document.getElementById('sidebar-toggle2');
    toggleButton.addEventListener('click', () => {
        sidebar.classList.toggle('collapsed');
        antiSidebar.classList.toggle('collapsed');
    });
    if (toggleButton2) {
      toggleButton2.addEventListener('click', () => {
          sidebar.classList.toggle('collapsed');
          antiSidebar.classList.toggle('collapsed');
      });
    }
    sidebar.addEventListener('transitionend', () => {
        if (sidebar.classList.contains('collapsed')) {
            sidebar.style.overflow = 'hidden';
        } else {
            sidebar.style.overflow = 'scroll';
        }
    });
});
(function() {
    let scrollRatio = 0;
    window.addEventListener('resize', () => {
        const docHeight = document.body.scrollHeight - window.innerHeight;
        if (docHeight > 0) {
        scrollRatio = window.scrollY / docHeight;
        }
    });
    window.addEventListener('resize', () => {
        setTimeout(() => {
        const docHeight = document.body.scrollHeight - window.innerHeight;
        window.scrollTo(0, scrollRatio * docHeight);
        }, 50);
    });
    })();
function adjustLayout() {
    const flexWrapper = document.getElementById('flex-wrapper');
    const mainElement = document.querySelector('.main');
    const windowWidth = window.innerWidth;
    const originalMainWidth = 800;
    const marginSize = 10;
    if (!mainElement || !flexWrapper) {
        console.error("Main element or flex wrapper not found.");
        return;
    }
    const scrollY = window.scrollY;
    const initialDocumentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const initialScrollPercentage = scrollY / initialDocumentHeight;
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
    const newDocumentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const newScrollPosition = newDocumentHeight * initialScrollPercentage;
    window.scrollTo(0, newScrollPosition);
}
adjustLayout();
window.addEventListener('resize', adjustLayout);