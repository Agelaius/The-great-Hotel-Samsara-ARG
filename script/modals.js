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

    function getFullMediaSource(src) {
        if (!src) return src;
        return src.replace("_small", "");
    }

    function isHeaderImage(el) {
        return el.classList && el.classList.contains("header-image");
    }

    const embeds = document.querySelectorAll("iframe, embed");

    const embedObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            if (el.dataset.src) {
                el.src = el.dataset.src;
                el.removeAttribute("data-src");
            }
            embedObserver.unobserve(el);
        });
    }, { rootMargin: "200px" });

    embeds.forEach(el => {
        if (el.src) {
            el.dataset.src = el.src;
            el.removeAttribute("src");
        }
        embedObserver.observe(el);
    });

    document.querySelectorAll(".container").forEach(container => {
        container.addEventListener("mouseenter", () => {
            const overlay = container.querySelector(".overlay");
            if (overlay) {
                const video = container.querySelector(".preview");
                const containerRect = container.getBoundingClientRect();
                const videoRect = video.getBoundingClientRect();

                overlay.style.width = `${video.offsetWidth}px`;
                overlay.style.height = `${video.offsetHeight}px`;
                overlay.style.opacity = 1;
                overlay.style.pointerEvents = 'auto';
                overlay.style.top = `${videoRect.top - containerRect.top}px`;
                overlay.style.left = `${videoRect.left - containerRect.left}px`;
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

            if (isHeaderImage(el) && el.dataset.video) {
                modalEl = document.createElement("video");
                modalEl.src = el.dataset.video;
                modalEl.controls = true;
                modalEl.autoplay = true;
                modalEl.playsInline = true;

            } else if (el instanceof HTMLImageElement) {
                modalEl = document.createElement("img");
                modalEl.src = getFullMediaSource(el.src);
                modalEl.alt = el.alt;

            } else if (el instanceof HTMLVideoElement) {
                modalEl = document.createElement("video");
                modalEl.src = getFullMediaSource(el.src);
                modalEl.controls = true;
                modalEl.autoplay = true;

            } else if (el instanceof HTMLIFrameElement || el.tagName === 'EMBED') {
                modalEl = document.createElement("embed");
                const src = el.dataset.src || el.src;
                const url = new URL(src);
                url.searchParams.delete('controls');
                url.searchParams.delete('mute');
                modalEl.src = url.toString();
                modalEl.type = 'video/mp4';
                modalEl.setAttribute('allowfullscreen', '');

            } else if (el.classList.contains("text-block")) {
                const textWrapper = document.createElement('div');
                textWrapper.classList.add('text-wrapper');

                const p = document.createElement("p");
                p.textContent = el.textContent;

                if (el.classList.contains('pre-formatted-text')) {
                    p.classList.add('scaled-text');
                }

                textWrapper.appendChild(p);

                const scrollButtons = document.createElement('div');
                scrollButtons.classList.add('scroll-buttons');
                scrollButtons.innerHTML = `
                    <button class="scroll-button scroll-up"><p>&#8963;</p></button>
                    <button class="scroll-button scroll-down"><p>&#8964;</p></button>
                `;
                modalBody.appendChild(scrollButtons);

                modalEl = textWrapper;
            }

            if (!modalEl) return;

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
                    mediaWidth = modalEl.offsetWidth || maxWidth;
                    mediaHeight = modalEl.offsetHeight || maxHeight;

                    let scale = 1;
                    const widthRatio = maxWidth / mediaWidth;
                    const heightRatio = maxHeight / mediaHeight;

                    if (mediaWidth > maxWidth || mediaHeight > maxHeight) {
                        scale = Math.min(widthRatio, heightRatio);
                    }

                    modalEl.style.transformOrigin = 'top left';
                    modalEl.style.transform = `scale(${scale}) translate(-50%, -50%)`;
                    modalEl.style.left = '50%';
                    modalEl.style.top = '50%';
                    modalEl.style.position = 'absolute';

                    const scaledText = modalEl.querySelector('.scaled-text');
                    if (scaledText) {
                        scaledText.style.fontSize = `.51vw`;
                        scaledText.style.transformOrigin = 'top left';
                        scaledText.style.transform = `scale(1)`;
                        scaledText.style.position = 'relative';
                        scaledText.style.display = 'block';
                    }

                    const scrollButtons = modal.querySelector('.scroll-buttons');
                    if (scrollButtons) {
                        scrollButtons.style.transformOrigin = 'top left';
                        scrollButtons.style.transform = `scale(${scale})`;
                        scrollButtons.style.left = '30%';
                        scrollButtons.style.top = '10%';
                        scrollButtons.style.position = 'absolute';
                    }

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

            if (modalEl.classList.contains('text-wrapper')) {
                initializeScrollButtons(modal);
            }
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
