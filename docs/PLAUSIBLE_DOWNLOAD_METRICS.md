# Plausible Download Metrics

Last updated: June 2, 2026

Nomfly's website can measure the visitor-to-store-click funnel in Plausible. The app stores own the next step, so first-time downloads must be read in App Store Connect and Play Console.

## Plausible goals to create

In Plausible for `nomfly.com`, go to Site settings > Goals > Add goal > Custom event and create:

- `Download App Click` for total website-to-store intent.
- `App Store Click` for iOS store clicks.
- `Google Play Click` for Android store clicks.

After at least one click is recorded, the event properties can show where the click came from:

- `store`: `app_store` or `google_play`
- `download_location`: `hero`, `download_panel`, or `deep_link_fallback`
- `visitor_platform`: `ios`, `android`, or `desktop`
- `page_path`: website path where the click happened

The site intentionally sends `Download App Click` plus the store-specific event for each app-store click. This gives a total download-click conversion goal and per-store goals without relying on property-filtered goals. Plausible counts custom events toward billable monthly pageviews, so each store click records two conversion events.

## Dashboard questions

- Overall website download-click rate: open the `Download App Click` goal and use its conversion rate.
- iOS click rate: open the `App Store Click` goal.
- Android click rate: open the `Google Play Click` goal.
- Which source sends download intent: filter the dashboard by a goal, then inspect Sources, Entry Pages, Countries, and Devices.
- Which CTA works: inspect the event properties and compare `download_location`.

## Store-side download attribution

Plausible cannot see the user's tap on Apple's `Get` button or Google Play's `Install` button after the user leaves `nomfly.com`.

For iOS:

1. In App Store Connect, open Nomfly > Analytics > Acquisition > Campaigns.
2. Create a campaign named `nomfly_site`.
3. Copy the generated campaign link. It should include both `pt=` and `ct=` parameters.
4. Replace the iOS website links with that generated URL.
5. In App Store Connect Analytics, filter by the `nomfly_site` campaign to see product page views, first-time downloads, sales, and retention. Apple only shows campaign data after privacy thresholds are met.

For Android:

1. The website Google Play links include `utm_source=nomfly_site`, `utm_medium=website`, and `utm_campaign=website_download`.
2. In Play Console, open Nomfly > Grow users > Store performance.
3. Filter traffic source to ads and referrals, then inspect UTM source/campaign.
4. Use store listing visitors, acquisitions, and conversion rate for actual Play Store install conversion.

## Best interpretation

Use Plausible for:

- `nomfly.com` visitors
- visitors who clicked a store download CTA
- conversion rate by traffic source, page, country, and device

Use the store consoles for:

- App Store/Play Store product page views
- first-time downloads/acquisitions
- store listing conversion rate
- downstream retention and purchases

## References

- Plausible custom events: https://plausible.io/docs/custom-event-goals
- Plausible custom properties: https://plausible.io/docs/custom-props/for-custom-events
- App Store Connect campaign links: https://developer.apple.com/help/app-store-connect-analytics/acquisition/campaign-links
- Google Play acquisition reports: https://support.google.com/googleplay/android-developer/answer/9859173
