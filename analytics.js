(function () {
    "use strict";

    var MEASUREMENT_ID = "G-7P2BKRZX8B";
    var CONSENT_KEY = "nomfly_analytics_consent_20260704";
    var COOKIE_MAX_AGE_SECONDS = 90 * 24 * 60 * 60;
    var initialized = false;
    var pageViewSent = false;
    var consentChoice = readStoredConsent();

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
    if (!currentPage) {
        return;
    }

    setDefaultConsent();
    document.addEventListener("click", handleTrackedLinkClick, true);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", setupAnalyticsControls);
    } else {
        setupAnalyticsControls();
    }

    function ensureGtagQueue() {
        window.dataLayer = window.dataLayer || [];
        window.gtag = window.gtag || function () {
            window.dataLayer.push(arguments);
        };
    }

    function setDefaultConsent() {
        ensureGtagQueue();
        window.gtag("consent", "default", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
    }

    function setupAnalyticsControls() {
        installConsentStyles();
        addAnalyticsChoicesControl();

        if (consentChoice === "granted") {
            initializeGoogleAnalytics();
        } else if (consentChoice !== "denied") {
            showConsentDialog();
        }
    }

    function readStoredConsent() {
        try {
            var value = window.localStorage.getItem(CONSENT_KEY);
            return value === "granted" || value === "denied" ? value : null;
        } catch (error) {
            return null;
        }
    }

    function storeConsent(value) {
        consentChoice = value;
        try {
            window.localStorage.setItem(CONSENT_KEY, value);
        } catch (error) {
            // The in-memory choice still applies for the current page.
        }
    }

    function grantAnalyticsConsent() {
        storeConsent("granted");
        hideConsentDialog();
        initializeGoogleAnalytics();
    }

    function denyAnalyticsConsent() {
        var analyticsWasInitialized = initialized;
        storeConsent("denied");
        ensureGtagQueue();
        window.gtag("consent", "update", {
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
        deleteGoogleAnalyticsCookies();
        hideConsentDialog();

        // Unload an already-running Google tag after consent is revoked.
        if (analyticsWasInitialized) {
            window.location.reload();
        }
    }

    function initializeGoogleAnalytics() {
        if (initialized || consentChoice !== "granted") {
            return;
        }

        initialized = true;
        ensureGtagQueue();
        window.gtag("consent", "update", {
            analytics_storage: "granted",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied"
        });
        window.gtag("set", "ads_data_redaction", true);
        sanitizeBrowserLocation();
        window.gtag("js", new Date());
        window.gtag("config", MEASUREMENT_ID, {
            send_page_view: false,
            allow_google_signals: false,
            allow_ad_personalization_signals: false,
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
        if (pageViewSent || consentChoice !== "granted") {
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
        if (!window.history || typeof window.history.replaceState !== "function") {
            return;
        }
        if (window.location.pathname !== currentPage.path || window.location.search || window.location.hash) {
            window.history.replaceState(null, "", currentPage.path);
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
        if (/iPhone|iPad|iPod/i.test(userAgent)) {
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
        if (consentChoice !== "granted" || !initialized) {
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

    function showConsentDialog() {
        var existing = document.getElementById("nomfly-analytics-consent");
        if (existing) {
            existing.hidden = false;
            var firstButton = existing.querySelector("button");
            if (firstButton) {
                firstButton.focus();
            }
            return;
        }

        var dialog = document.createElement("section");
        dialog.id = "nomfly-analytics-consent";
        dialog.className = "analytics-consent";
        dialog.setAttribute("role", "dialog");
        dialog.setAttribute("aria-labelledby", "nomfly-analytics-consent-title");
        dialog.setAttribute("aria-describedby", "nomfly-analytics-consent-description");
        dialog.innerHTML = [
            '<div class="analytics-consent-copy">',
            '<strong id="nomfly-analytics-consent-title">Help improve Nomfly</strong>',
            '<p id="nomfly-analytics-consent-description">Allow privacy-limited Google Analytics to measure visits and download-button clicks. Advertising and cross-site tracking stay off.</p>',
            '<a href="https://www.nomfly.com/privacy/">Privacy details</a>',
            '</div>',
            '<div class="analytics-consent-actions">',
            '<button type="button" data-analytics-choice="denied">No thanks</button>',
            '<button type="button" data-analytics-choice="granted">Allow analytics</button>',
            '</div>'
        ].join("");

        dialog.querySelector('[data-analytics-choice="denied"]').addEventListener("click", denyAnalyticsConsent);
        dialog.querySelector('[data-analytics-choice="granted"]').addEventListener("click", grantAnalyticsConsent);
        document.body.appendChild(dialog);
    }

    function hideConsentDialog() {
        var dialog = document.getElementById("nomfly-analytics-consent");
        if (dialog) {
            dialog.hidden = true;
        }
    }

    function addAnalyticsChoicesControl() {
        if (document.querySelector("[data-analytics-settings]")) {
            return;
        }

        var button = document.createElement("button");
        button.type = "button";
        button.className = "analytics-settings";
        button.textContent = "Analytics choices";
        button.setAttribute("data-analytics-settings", "true");
        button.addEventListener("click", showConsentDialog);

        var footerLinks = document.querySelector(".footer-links");
        if (footerLinks) {
            if (footerLinks.querySelector(".divider")) {
                var divider = document.createElement("span");
                divider.className = "divider";
                footerLinks.appendChild(divider);
            }
            footerLinks.appendChild(button);
        } else {
            button.className += " analytics-settings-floating";
            document.body.appendChild(button);
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

    function installConsentStyles() {
        if (document.getElementById("nomfly-analytics-styles")) {
            return;
        }

        var style = document.createElement("style");
        style.id = "nomfly-analytics-styles";
        style.textContent = [
            ".analytics-consent{position:fixed;z-index:10000;left:16px;right:16px;bottom:16px;display:flex;align-items:center;justify-content:space-between;gap:20px;max-width:920px;margin:0 auto;padding:18px 20px;border:1px solid rgba(46,107,87,.2);border-radius:16px;background:#fff;color:#2e2e33;box-shadow:0 18px 55px rgba(32,48,42,.22);font-family:-apple-system,BlinkMacSystemFont,\"SF Pro Display\",\"Segoe UI\",sans-serif;text-align:left}",
            ".analytics-consent[hidden]{display:none}",
            ".analytics-consent-copy{max-width:620px}",
            ".analytics-consent strong{display:block;margin-bottom:4px;font-size:1rem}",
            ".analytics-consent p{margin:0 0 4px;color:#555;font-size:.9rem;line-height:1.45}",
            ".analytics-consent a{color:#2e6b57;font-size:.86rem;font-weight:600}",
            ".analytics-consent-actions{display:flex;gap:10px;flex-shrink:0}",
            ".analytics-consent button,.analytics-settings{min-height:40px;padding:9px 14px;border:1px solid #2e6b57;border-radius:10px;background:#fff;color:#2e6b57;font:600 .88rem -apple-system,BlinkMacSystemFont,\"SF Pro Display\",\"Segoe UI\",sans-serif;cursor:pointer}",
            ".analytics-consent button[data-analytics-choice=\"granted\"]{background:#2e6b57;color:#fff}",
            ".analytics-consent button:focus-visible,.analytics-settings:focus-visible{outline:3px solid rgba(242,140,56,.45);outline-offset:2px}",
            ".analytics-settings{min-height:auto;padding:0;border:0;border-radius:0;background:transparent;color:inherit;font-size:inherit}",
            ".analytics-settings:hover{color:#f28c38}",
            ".analytics-settings-floating{position:fixed;z-index:9999;left:12px;bottom:12px;padding:7px 10px;border:1px solid rgba(46,107,87,.25);border-radius:9px;background:rgba(255,255,255,.94);color:#2e6b57;box-shadow:0 6px 18px rgba(32,48,42,.12)}",
            "@media(max-width:680px){.analytics-consent{align-items:stretch;flex-direction:column;gap:14px}.analytics-consent-actions{display:grid;grid-template-columns:1fr 1fr}.analytics-consent button{width:100%}}"
        ].join("");
        document.head.appendChild(style);
    }
}());
