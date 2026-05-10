(function () {
    var carousel = document.querySelector("[data-screenshot-carousel]");
    if (!carousel) {
        return;
    }

    var track = carousel.querySelector("[data-carousel-track]");
    var slides = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-slide]"));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll("[data-carousel-dot]"));
    var progress = carousel.querySelector("[data-carousel-progress]");
    var intervalMs = 4000;
    var activeIndex = 0;
    var timer = null;
    var resumeTimer = null;
    var resetTimer = null;
    var reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var realSlideCount = dots.length || slides.length;
    var transitionMs = 580;

    function restartProgress() {
        if (!progress || reducedMotion) {
            return;
        }
        progress.style.animation = "none";
        progress.offsetHeight;
        progress.style.animation = "carouselProgress " + intervalMs + "ms linear forwards";
    }

    function render() {
        var dotIndex = activeIndex % realSlideCount;
        track.style.transform = "translate3d(-" + (activeIndex * 100) + "%, 0, 0)";
        slides.forEach(function (slide, index) {
            slide.classList.toggle("is-active", index === activeIndex);
            slide.setAttribute("aria-hidden", index === activeIndex && index < realSlideCount ? "false" : "true");
        });
        dots.forEach(function (dot, index) {
            dot.classList.toggle("is-active", index === dotIndex);
            dot.setAttribute("aria-current", index === dotIndex ? "true" : "false");
        });
        restartProgress();
    }

    function jumpWithoutAnimation(index) {
        track.style.transition = "none";
        activeIndex = index;
        render();
        track.offsetHeight;
        track.style.transition = "";
    }

    function show(index) {
        if (resetTimer) {
            window.clearTimeout(resetTimer);
            resetTimer = null;
        }
        activeIndex = index < 0 ? realSlideCount - 1 : index;
        render();
        if (activeIndex >= realSlideCount) {
            resetTimer = window.setTimeout(function () {
                resetTimer = null;
                jumpWithoutAnimation(0);
            }, transitionMs + 30);
        }
    }

    function stop() {
        if (timer) {
            window.clearInterval(timer);
            timer = null;
        }
        if (progress) {
            progress.style.animationPlayState = "paused";
        }
    }

    function start() {
        if (reducedMotion || timer) {
            return;
        }
        if (progress) {
            progress.style.animationPlayState = "running";
        }
        timer = window.setInterval(function () {
            show(activeIndex + 1);
        }, intervalMs);
    }

    function pauseBriefly() {
        stop();
        if (resumeTimer) {
            window.clearTimeout(resumeTimer);
        }
        resumeTimer = window.setTimeout(function () {
            resumeTimer = null;
            start();
        }, 6000);
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            stop();
            show(index);
            start();
        });
    });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", start);
    carousel.addEventListener("touchstart", pauseBriefly, { passive: true });

    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stop();
        } else {
            start();
        }
    });

    render();
    start();
}());
