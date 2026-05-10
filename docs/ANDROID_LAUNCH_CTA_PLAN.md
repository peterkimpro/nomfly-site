# Android Launch CTA Plan

When Nomfly is live on both iOS and Android, keep both store badges visible for credibility, but make the device-matched store the primary mobile action.

## Recommended Behavior

- iPhone/iPad visitors: show App Store first/larger with the tap/download cue; keep Google Play visible as a secondary option.
- Android visitors: show Google Play first/larger with the tap/download cue; keep App Store visible as a secondary option.
- Desktop or unknown visitors: show both store badges side-by-side with similar weight under a clear "Download Nomfly" cue.
- Detection failures should fall back to showing both stores equally. Do not hide either live store.

## Implementation Notes

- Use lightweight JavaScript to set a platform class on `<html>`, such as `platform-ios`, `platform-android`, `platform-desktop`, or `platform-unknown`.
- Detect platform class only; do not try to detect exact iPhone model.
- Use CSS to assign the existing primary CTA treatment to the matching store badge.
- Keep the mobile layout to one dominant install action plus one visible secondary option, rather than two competing full-strength buttons.
- Preserve `prefers-reduced-motion` behavior for any pulse, heartbeat, or arrow animation.

