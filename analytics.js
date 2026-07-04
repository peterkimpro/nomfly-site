(function () {
    "use strict";

    var MEASUREMENT_ID = "G-7P2BKRZX8B";
    var COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;
    var COOKIE_RESTRICTED_REGIONS = [
        "AT", "AX", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR",
        "DE", "GR", "HU", "IS", "IE", "IT", "LV", "LI", "LT", "LU",
        "MT", "NL", "NO", "PL", "PT", "RO", "SK", "SI", "ES", "SE",
        "GB", "GI", "GG", "IM", "JE", "CH", "CA",
        "GF", "GP", "MF", "MQ", "RE", "YT"
    ];
    var initialized = false;
    var pageViewSent = false;

    var SAFE_PAGES = {
        "/": { path: "/", group: "home", title: "Nomfly" },
        "/privacy": { path: "/privacy/", group: "privacy", title: "Nomfly Privacy Policy" },
        "/privacy/": { path: "/privacy/", group: "privacy", title: "Nomfly Privacy Policy" },
        "/terms": { path: "/terms/", group: "terms", title: "Nomfly Terms of Service" },
        "/terms/": { path: "/terms/", group: "terms", title: "Nomfly Terms of Service" },
        "/account-deletion": { path: "/account-deletion/", group: "account_deletion", title: "Delete Your Nomfly Account" },
        "/account-deletion/": { path: "/account-deletion/", group: "account_deletion", title: "Delete Your Nomfly Account" },
        "/support": { path: "/support/", group: "support", title: "Nomfly Support" },
        "/support/": { path: "/support/", group: "support", title: "Nomfly Support" },
        "/404.html": { path: "/404.html", group: "not_found", title: "Nomfly Page Not Found" }
    };

    var currentPage = SAFE_PAGES[window.location.pathname || "/"];

    // Arbitrary 404 and app deep-link paths can contain private identifiers or
    // query metadata. Do not load analytics on routes outside this allowlist.
    if (!currentPage || !analyticsHostAllowed()) {
        return;
    }
    if (browserRequestsNoTracking() || hasStoredAnalyticsOptOut()) {
        deleteGoogleAnalyticsCookies();
        return;
    }

    setMeasurementDefaults();
    initializeGoogleAnalytics();
    document.addEventListener("click", handleTrackedLinkClick, true);

    function ensureGtagQueue() {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
    }

    function analyticsHostAllowed() {
        var hostname = (window.location.hostname || "").toLowerCase();
        if (hostname === "www.nomfly.com" || hostname === "nomfly.com") {
            return true;
        }
        return (hostname === "127.0.0.1" || hostname === "localhost") &&
            window.__NOMFLY_ANALYTICS_QA__ === true;
    }

    function browserRequestsNoTracking() {
        return privacySignalEnabled(navigator.globalPrivacyControl) ||
            privacySignalEnabled(navigator.doNotTrack) ||
            privacySignalEnabled(window.doNotTrack) ||
            privacySignalEnabled(navigator.msDoNotTrack);
    }

    function privacySignalEnabled(value) {
        if (value === true || value === 1) {
            return true;
        }
        return typeof value === "string" &&
            (value.toLowerCase() === "1" || value.toLowerCase() === "yes");
    }

    function hasStoredAnalyticsOptOut() {
        try {
            return window.localStorage.getItem("nomfly_analytics_consent_20260704") === "denied";
        } catch (error) {
            return false;
        }
    }

    function deleteGoogleAnalyticsCookies() {
        var cookies = document.cookie ? document.cookie.split(";") : [];
        var domains = ["", window.location.hostname, "." + window.location.hostname];
        var hostParts = window.location.hostname.split(".");
        if (hostParts.length > 2) {
            domains.push("." + hostParts.slice(-2).join("."));
        }

        cookies.forEach(function (cookie) {
            var name = cookie.split("=")[0].trim();
            if (name !== "_ga" && name.indexOf("_ga_") !== 0) {
                return;
            }
            domains.forEach(function (domain) {
                var domainPart = domain ? "; Domain=" + domain : "";
                document.cookie = name + "=; Max-Age=0; Path=/; SameSite=Lax" + domainPart;
            });
        });
    }

    function setMeasurementDefaults() {
        ensureGtagQueue();
        window.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
            region: COOKIE_RESTRICTED_REGIONS
        });
        window.gtag("consent", "default", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
    }

    function initializeGoogleAnalytics() {
        if (initialized) {
            return;
        }

        if (!sanitizeBrowserLocation()) {
            return;
        }

        initialized = true;
        ensureGtagQueue();
        window.gtag("set", "ads_data_redaction", true);
        window.gtag("js", new Date());
        window.gtag("config", MEASUREMENT_ID, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
            page_title: currentPage.title,
            page_location: window.location.origin + currentPage.path,
            page_path: currentPage.path,
            page_referrer: sanitizedReferrerOrigin(),
            cookie_expires: COOKIE_MAX_AGE_SECONDS,
            cookie_update: false
        });

        loadGoogleTag();
        sendSanitizedPageView();
    }

    function loadGoogleTag() {
        if (document.querySelector("script[data-nomfly-google-tag]")) {
            return;
        }

        var script = document.createElement("script");
        script.async = true;
        script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
        script.setAttribute("data-nomfly-google-tag", "true");
        document.head.appendChild(script);
    }

    function sendSanitizedPageView() {
        if (pageViewSent) {
            return;
        }

        pageViewSent = true;
        window.gtag("event", "page_view", {
            send_to: MEASUREMENT_ID,
            page_title: currentPage.title,
            page_location: window.location.origin + currentPage.path,
            page_path: currentPage.path,
            page_group: currentPage.group,
            page_referrer: sanitizedReferrerOrigin()
        });
    }

    function sanitizedReferrerOrigin() {
        if (!document.referrer) {
            return "";
        }
        try {
            return new URL(document.referrer).origin;
        } catch (error) {
            return "";
        }
    }

    function sanitizeBrowserLocation() {
        var needsSanitizing = window.location.pathname !== currentPage.path ||
            window.location.search ||
            window.location.hash;
        if (!needsSanitizing) {
            return true;
        }
        if (!window.history || typeof window.history.replaceState !== "function") {
            return false;
        }
        try {
            window.history.replaceState(null, "", currentPage.path);
            return true;
        } catch (error) {
            return false;
        }
    }

    function closestLink(target) {
        while (target && target !== document) {
            if (target.tagName === "A") {
                return target;
            }
            target = target.parentNode;
        }
        return null;
    }

    function visitorPlatform() {
        var userAgent = navigator.userAgent || "";
        if (/Android/i.test(userAgent)) {
            return "android";
        }
        if (/iPhone|iPad|iPod/i.test(userAgent) ||
            (/Macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1)) {
            return "ios";
        }
        return "desktop";
    }

    function downloadStore(link, href) {
        var explicitStore = link.getAttribute("data-download-store");
        if (explicitStore === "app_store" || explicitStore === "google_play") {
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
        var location = link.getAttribute("data-download-location") || "other";
        return location === "hero" || location === "download_panel" || location === "deep_link_fallback"
            ? location
            : "other";
    }

    function storeEventName(store) {
        return store === "app_store" ? "app_store_click" : "google_play_click";
    }

    function isPlainLeftClick(event, link) {
        return event.button === 0 &&
            !event.metaKey &&
            !event.ctrlKey &&
            !event.shiftKey &&
            !event.altKey &&
            (!link.target || link.target === "_self");
    }

    function handleTrackedLinkClick(event) {
        if (!initialized) {
            return;
        }

        var link = closestLink(event.target);
        if (!link) {
            return;
        }

        var href = link.href || "";
        var store = downloadStore(link, href);
        var eventNames = [];
        var params = { page_group: currentPage.group };

        if (store) {
            params.store = store;
            params.download_location = downloadLocation(link);
            params.visitor_platform = visitorPlatform();
            eventNames.push(storeEventName(store));
            eventNames.push("download_app_click");
        } else if (href.indexOf("mailto:") === 0) {
            eventNames.push("support_email_click");
        } else if (href.indexOf("instagram.com") !== -1) {
            params.social_platform = "instagram";
            eventNames.push("social_click");
        } else if (href.indexOf("tiktok.com") !== -1) {
            params.social_platform = "tiktok";
            eventNames.push("social_click");
        } else if (href.indexOf("nomfly://") === 0) {
            params.deep_link_type = "app";
            eventNames.push("open_app_click");
        }

        if (!eventNames.length) {
            return;
        }

        if (store && isPlainLeftClick(event, link)) {
            event.preventDefault();
            sendEvents(eventNames, params, function () {
                window.location.href = href;
            });
        } else {
            sendEvents(eventNames, params);
        }
    }

    function sendEvents(eventNames, params, callback) {
        var finished = false;

        function done() {
            if (!finished) {
                finished = true;
                if (callback) {
                    callback();
                }
            }
        }

        if (callback) {
            window.setTimeout(done, 1200);
        }

        eventNames.forEach(function (eventName, index) {
            var eventParams = {};
            Object.keys(params).forEach(function (key) {
                eventParams[key] = params[key];
            });
            eventParams.send_to = MEASUREMENT_ID;

            if (callback && index === eventNames.length - 1) {
                eventParams.event_callback = done;
                eventParams.event_timeout = 1000;
            }

            window.gtag("event", eventName, eventParams);
        });
    }

}());
