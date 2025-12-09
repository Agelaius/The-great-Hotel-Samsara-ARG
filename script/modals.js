document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("mediaModal");
    const modalBody = modal.querySelector(".modal-body");
    const closeBtn = modal.querySelector(".close");

    document.querySelectorAll("video.preview").forEach(video => {
        video.addEventListener("mouseenter", () => {
            video.currentTime = 0;
            video.play();
        });
        video.addEventListener("mouseleave", () => {
            video.pause();
            video.currentTime = 0;
        });
    });

    const disableScroll = () => {
        document.body.style.overflow = 'hidden';
    };

    const enableScroll = () => {
        document.body.style.overflow = '';
    };

    document.querySelectorAll(".container").forEach(container => {
        container.addEventListener("mouseenter", () => {
            const overlay = container.querySelector(".overlay");
            if (overlay) {
                const video = container.querySelector(".preview");
                const containerRect = container.getBoundingClientRect();
                const videoRect = video.getBoundingClientRect();

                const topOffset = videoRect.top - containerRect.top;
                const leftOffset = videoRect.left - containerRect.left;

                overlay.style.width = `${video.offsetWidth}px`;
                overlay.style.height = `${video.offsetHeight}px`;
                overlay.style.opacity = 1;
                overlay.style.pointerEvents = 'auto';

                overlay.style.top = `${topOffset}px`;
                overlay.style.left = `${leftOffset}px`;
            }

        });

        container.addEventListener("mouseleave", () => {
            const overlay = container.querySelector(".overlay");
            if (overlay) {
                overlay.style.width = `100%`;
                overlay.style.height = `100%`;
                overlay.style.opacity = 0;
                overlay.style.pointerEvents = 'none';
                overlay.style.top = '0';
                overlay.style.left = '0';
            }
        });

        container.addEventListener("click", () => {
            const el = container.querySelector(".zoomable");
            if (!el) return;

            modalBody.innerHTML = "";
            modal.classList.add("show");
            disableScroll();

            let modalEl;

            if (el instanceof HTMLImageElement) {
                modalEl = document.createElement("img");
                modalEl.src = el.src;
                modalEl.alt = el.alt;
            } else if (el instanceof HTMLVideoElement) {
                modalEl = document.createElement("video");
                modalEl.src = el.src;
                modalEl.controls = true;
                modalEl.autoplay = true;
            } else if (el instanceof HTMLIFrameElement || el.tagName === 'EMBED') {
                modalEl = document.createElement("embed");
                let src = el.src || el.getAttribute('src');

                let url = new URL(src);

                url.searchParams.delete('controls');
                url.searchParams.delete('mute');


                modalEl.src = url.toString();
                modalEl.type = 'video/mp4';
                modalEl.setAttribute('allowfullscreen', '');
            } else if (el.classList.contains("text-block")) {
                const textWrapper = document.createElement('div');
                textWrapper.classList.add('text-wrapper');
                modalEl = document.createElement("p");
                modalEl.textContent = el.textContent;
                textWrapper.appendChild(modalEl);
                modalEl = textWrapper;
            } else {
                modalEl = null;
            }

            if (modalEl) {
                modalEl.classList.add("modal-media");
                modalBody.appendChild(modalEl);

                const adjustModalSize = () => {
                    const maxWidth = window.innerWidth * 0.8;
                    const maxHeight = window.innerHeight * 0.8;

                    let mediaWidth, mediaHeight;

                    if (modalEl instanceof HTMLImageElement) {
                        mediaWidth = modalEl.naturalWidth;
                        mediaHeight = modalEl.naturalHeight;
                    } else if (modalEl instanceof HTMLVideoElement) {
                        mediaWidth = modalEl.videoWidth;
                        mediaHeight = modalEl.videoHeight;
                    } else if (modalEl.tagName === 'EMBED' || modalEl.tagName === 'IFRAME') {
                        mediaWidth = maxWidth;
                        mediaHeight = maxWidth * (9 / 16);

                        if (mediaHeight > maxHeight) {
                            mediaHeight = maxHeight;
                            mediaWidth = maxHeight * (16 / 9);
                        }

                        modalEl.style.width = `${mediaWidth}px`;
                        modalEl.style.height = `${mediaHeight}px`;
                        return;

                    } else if (modalEl.classList && modalEl.classList.contains('text-wrapper')) {
                        mediaWidth = modalEl.offsetWidth;
                        mediaHeight = modalEl.offsetHeight;

                        let scale = 1;

                        let widthRatio = maxWidth / mediaWidth;
                        let heightRatio = maxHeight / mediaHeight;

                        if (mediaWidth > maxWidth || mediaHeight > maxHeight) {
                            scale = Math.min(widthRatio, heightRatio);
                        }

                        modalEl.style.transformOrigin = 'top left';
                        modalEl.style.transform = `scale(${scale})`;
                        return;
                    }

                    const widthRatio = maxWidth / mediaWidth;
                    const heightRatio = maxHeight / mediaHeight;

                    let newWidth = mediaWidth;
                    let newHeight = mediaHeight;

                    if (widthRatio < heightRatio) {
                        newWidth = maxWidth;
                        newHeight = mediaHeight * widthRatio;
                    } else {
                        newHeight = maxHeight;
                        newWidth = mediaWidth * heightRatio;
                    }

                    modalEl.style.width = `${newWidth}px`;
                    modalEl.style.height = `${newHeight}px`;
                };

                adjustModalSize();
                window.addEventListener('resize', adjustModalSize);
            }

            const closeModal = () => {
                modal.classList.remove("show");
                modalBody.innerHTML = "";
                window.removeEventListener('resize', adjustModalSize);
                enableScroll();
            };

            closeBtn.addEventListener("click", closeModal);
            modal.addEventListener("click", e => {
                if (e.target === modal) closeModal();
            });
        });
    });

    const closeModal = () => {
        modal.classList.remove("show");
        modalBody.innerHTML = "";
        enableScroll();
    };

    closeBtn.addEventListener("click", closeModal);
    modal.addEventListener("click", e => {
        if (e.target === modal) closeModal();
    });
});
