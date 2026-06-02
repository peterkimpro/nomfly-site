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
        if (!link || typeof window.plausible !== "function") {
            return;
        }

        var href = link.href || "";
        var eventName = null;
        var props = {
            link_url: href,
            link_text: compactText(link.textContent || link.getAttribute("aria-label")),
            page_path: window.location.pathname
        };

        if (href.indexOf("apps.apple.com") !== -1) {
            eventName = "App Store Click";
            props.store = "app_store";
        } else if (href.indexOf("play.google.com") !== -1) {
            eventName = "Google Play Click";
            props.store = "google_play";
        } else if (href.indexOf("mailto:") === 0) {
            eventName = "Support Email Click";
        } else if (href.indexOf("instagram.com") !== -1) {
            eventName = "Social Click";
            props.platform = "instagram";
        } else if (href.indexOf("tiktok.com") !== -1) {
            eventName = "Social Click";
            props.platform = "tiktok";
        } else if (href.indexOf("nomfly://") === 0) {
            eventName = "Open App Click";
        }

        if (eventName) {
            window.plausible(eventName, { props: props });
        }
    });
}());
