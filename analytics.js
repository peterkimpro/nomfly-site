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

    document.addEventListener("click", function (event) {
        var link = closestLink(event.target);
        if (!link || typeof window.gtag !== "function") {
            return;
        }

        var href = link.href || "";
        var eventName = null;
        var params = {
            link_url: href,
            link_text: compactText(link.textContent || link.getAttribute("aria-label")),
            page_location: window.location.href
        };

        if (href.indexOf("apps.apple.com") !== -1) {
            eventName = "app_store_click";
            params.store = "app_store";
        } else if (href.indexOf("play.google.com") !== -1) {
            eventName = "google_play_click";
            params.store = "google_play";
        } else if (href.indexOf("mailto:") === 0) {
            eventName = "support_email_click";
        } else if (href.indexOf("instagram.com") !== -1) {
            eventName = "social_click";
            params.platform = "instagram";
        } else if (href.indexOf("tiktok.com") !== -1) {
            eventName = "social_click";
            params.platform = "tiktok";
        } else if (href.indexOf("nomfly://") === 0) {
            eventName = "open_app_click";
        }

        if (eventName) {
            window.gtag("event", eventName, params);
        }
    });
}());
