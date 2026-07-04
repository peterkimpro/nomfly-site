# Google Analytics Website Metrics

Last updated: July 4, 2026

Nomfly's GitHub Pages website sends consented website analytics to the Google Analytics 4 web stream with Measurement ID `G-7P2BKRZX8B`. The app stores own the next step after a visitor leaves the website, so actual downloads must still be read in App Store Connect and Play Console.

## Privacy and consent behavior

- The Google tag is not requested or initialized before the visitor chooses **Allow analytics**.
- Choosing **No thanks** leaves Google Analytics unloaded.
- Advertising storage, Google Signals, ad personalization, and ad-user-data collection remain disabled even after analytics consent.
- The website remembers only the consent choice in local storage.
- **Analytics choices** in the footer lets the visitor change the choice. Revoking consent removes `_ga` cookies and reloads without the Google tag.
- Analytics cookies are configured for a fixed maximum age of 90 days and are not renewed on later visits.
- Only known canonical pages are measured. Arbitrary 404 and app deep-link routes are excluded so UUIDs and visitor-supplied page query values cannot reach Google Analytics. Fixed public app-store campaign parameters can appear in outbound-link measurement if Enhanced Measurement remains enabled.
- Referrers are reduced to their origin. Nomfly's custom events use fixed categories rather than raw URLs or link text. If GA4 Enhanced Measurement remains enabled, it can separately record fixed public outbound-link destinations on the allowlisted pages.

## Website events

| GA4 event | Meaning | Parameters |
|---|---|---|
| `page_view` | Consented visit to a canonical website page | `page_group`, sanitized `page_path`, sanitized `page_location` |
| `download_app_click` | Any App Store or Google Play CTA click | `store`, `download_location`, `visitor_platform`, `page_group` |
| `app_store_click` | App Store CTA click | Same download parameters |
| `google_play_click` | Google Play CTA click | Same download parameters |
| `support_email_click` | Support email link click | `page_group` |
| `social_click` | Instagram or TikTok link click | `social_platform`, `page_group` |
| `open_app_click` | Allowlisted Nomfly app link click | `deep_link_type`, `page_group` |

Store clicks send the store-specific event and `download_app_click`. Same-tab store navigation waits for the GA callback, with a 1.2-second local fallback so an ad blocker or network failure cannot trap the visitor on the website.

## GA4 dashboard configuration

Event collection works from the deployed code without custom definitions. For clearer reporting in Google Analytics:

1. Confirm the web data stream URL is `https://www.nomfly.com/` and its Measurement ID is `G-7P2BKRZX8B`.
2. In the web stream's Enhanced Measurement settings, disable outbound-click measurement if you want to avoid duplicate automatic `click` events. Nomfly already sends the sanitized custom click events above; leaving the setting on can add standard outbound events for the site's fixed public links.
3. Create event-scoped custom dimensions for `store`, `download_location`, `visitor_platform`, `page_group`, `social_platform`, and `deep_link_type` if those parameter values should appear in standard reports and Explorations.
4. Mark `download_app_click` as a key event if website-to-store intent is a primary conversion.
5. Use Realtime or DebugView to confirm events during QA. Standard reports and newly registered custom dimensions can take longer to populate.

## Dashboard questions

- Overall website-to-store intent: filter event name to `download_app_click`.
- iOS store intent: filter to `app_store_click`.
- Android store intent: filter to `google_play_click`.
- Which CTA works: compare `download_location` (`hero`, `download_panel`, or `deep_link_fallback`).
- Which device class clicks: compare `visitor_platform` (`ios`, `android`, or `desktop`).
- Which pages drive action: compare `page_group`.

## Store-side download attribution

Google Analytics cannot see the user's tap on Apple's **Get** button or Google Play's **Install** button after the user leaves `nomfly.com`.

For iOS:

1. Website App Store links use `https://apps.apple.com/app/apple-store/id6766716117?pt=128870510&ct=nomfly_site&mt=8`.
2. In App Store Connect Analytics, filter by campaign `nomfly_site` for product-page views and first-time downloads after Apple's reporting thresholds and delay.

For Android:

1. Website Google Play links include `utm_source=nomfly_site`, `utm_medium=website`, and `utm_campaign=website_download`.
2. In Play Console, use Store performance and acquisition reporting for store-listing visitors, acquisitions, and conversion rate.

## Mobile app analytics are separate

The web Measurement ID is not a safe native-app analytics configuration. Current distributed iOS and Android builds still attempt a one-time first-open event through their existing Plausible tracker. Migrating those events into the same GA4 property requires Firebase iOS and Android app streams, platform configuration files, updated privacy/store disclosures, QA, and new store binaries. Never place a Google Analytics Measurement Protocol API secret in client-side website or mobile-app code.

## References

- Google tag setup: https://support.google.com/analytics/answer/15756615
- GA4 events: https://developers.google.com/analytics/devguides/collection/ga4/events
- Event parameters and custom dimensions: https://developers.google.com/analytics/devguides/collection/ga4/event-parameters
- Consent Mode: https://developers.google.com/tag-platform/security/guides/consent
- App Store Connect campaign links: https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
- Google Play acquisition reports: https://support.google.com/googleplay/android-developer/answer/9859173
