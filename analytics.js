(function () {
    function closestLink(target) {
        while (target && target !== document) {
            if (target.tagName === "A") {
                return target;
            }
            target = target.parentNode;
        }
        return null;
    }

    function compactText(value) {
        return (value || "").replace(/\s+/g, " ").trim().slice(0, 100);
    }

    function visitorPlatform() {
        var ua = navigator.userAgent || "";
        if (/Android/i.test(ua)) {
            return "android";
        }
        if (/iPhone|iPad|iPod/i.test(ua)) {
            return "ios";
        }
        return "desktop";
    }

    function downloadStore(link, href) {
        var explicitStore = link.getAttribute("data-download-store");
        if (explicitStore) {
            return explicitStore;
        }
        if (href.indexOf("apps.apple.com") !== -1) {
            return "app_store";
        }
        if (href.indexOf("play.google.com") !== -1) {
            return "google_play";
        }
        return "";
    }

    function downloadLocation(link) {
        return link.getAttribute("data-download-location") || "";
    }

    function storeEventName(store) {
        if (store === "app_store") {
            return "App Store Click";
        }
        if (store === "google_play") {
            return "Google Play Click";
        }
        return "";
    }

    function isPlainLeftClick(event, link) {
        return event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey &&
            (!link.target || link.target === "_self");
    }

    function sendEvents(eventNames, props, callback) {
        var remaining = eventNames.length;
        var finished = false;

        function done() {
            remaining -= 1;
            if (!finished && remaining <= 0) {
                finished = true;
                callback();
            }
        }

        window.setTimeout(function () {
            if (!finished) {
                finished = true;
                callback();
            }
        }, 1200);

        eventNames.forEach(function (eventName) {
            window.plausible(eventName, { props: props, callback: done });
        });
    }

    document.addEventListener("click", function (event) {
        var link = closestLink(event.target);
        if (!link || typeof window.plausible !== "function") {
            return;
        }

        var href = link.href || "";
        var store = downloadStore(link, href);
        var eventNames = [];
        var props = {
            link_url: href,
            link_text: compactText(link.textContent || link.getAttribute("aria-label")),
            page_path: window.location.pathname,
            visitor_platform: visitorPlatform()
        };

        if (store) {
            props.store = store;
            props.download_location = downloadLocation(link);
            eventNames.push("Download App Click");
            if (storeEventName(store)) {
                eventNames.push(storeEventName(store));
            }
        } else if (href.indexOf("mailto:") === 0) {
            eventNames.push("Support Email Click");
        } else if (href.indexOf("instagram.com") !== -1) {
            props.platform = "instagram";
            eventNames.push("Social Click");
        } else if (href.indexOf("tiktok.com") !== -1) {
            props.platform = "tiktok";
            eventNames.push("Social Click");
        } else if (href.indexOf("nomfly://") === 0) {
            eventNames.push("Open App Click");
        }

        if (!eventNames.length) {
            return;
        }

        if (store && isPlainLeftClick(event, link)) {
            event.preventDefault();
            sendEvents(eventNames, props, function () {
                window.location.href = href;
            });
        } else {
            eventNames.forEach(function (eventName) {
                window.plausible(eventName, { props: props });
            });
        }
    });
}());
