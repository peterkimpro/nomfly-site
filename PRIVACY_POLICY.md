# Nomfly Privacy Policy

**Last Updated: July 4, 2026**

Tapwise Digital LLC ("we," "us," or "our") operates the Nomfly mobile application and website. This Privacy Policy explains how we collect, use, and share your personal information.

## 1. Information We Collect

### Information You Provide
- **Account Information:** Email address and display name (via AWS Cognito)
- **Taste Preferences:** Cuisine scores, spice tolerance, dietary restrictions, disliked ingredients (from onboarding quiz and ongoing use)
- **Meal History:** Accepted/rejected meal decisions, star ratings, timestamps
- **Household Information:** Names and dietary restrictions of household members you add
- **User-Submitted Recipes:** Titles, ingredients, steps, and descriptions you submit
- **Grocery Lists:** Items you add to your shopping lists
- **Saved Recipes & Collections:** Recipes you save and how you organize them

### Information Collected Automatically
- **App Usage Data:** Decision counts, feature usage patterns, session frequency, and first-open activation events
- **Website Analytics (with your consent):** Sanitized page groups, referrer origin, browser/device information, approximate geography, pseudonymous client/session identifiers, and controlled click events for app-store, support, and social links through Google Analytics
- **Mobile Activation Analytics:** Some currently distributed iOS and Android versions send a one-time first-open event to Plausible with app platform, version, and build. Android may include Google Play campaign source/medium/campaign values when available.
- **Device Information:** iOS version, device model (for compatibility only)

### Information Processed Temporarily
- **Fridge Photos:** When you use the ingredient scan feature, your photo is sent to Anthropic's Claude Vision API for ingredient identification. The photo is NOT stored on our servers. It is transmitted via encrypted connection (TLS 1.3), processed, and discarded.

## 2. Third-Party Service Providers

Nomfly uses third-party services to power core features and understand website traffic. **We explicitly disclose these providers and what data they receive:**

### Anthropic (Claude AI)
- **Purpose:** Meal decision suggestions, taste learning, recipe selection, fridge photo scanning
- **Data Shared:** Meal preferences, cuisine scores, dietary restrictions, fridge contents (text), fridge photos (temporary, for vision scan only)
- **Data NOT Shared:** Your name, email, location, or payment information
- **Anthropic's Privacy Policy:** https://www.anthropic.com/privacy

### Google (Gemini)
- **Purpose:** AI-generated food photography for recipe cards
- **Data Shared:** Recipe titles and key ingredients (text only, for image generation prompts)
- **Data NOT Shared:** Any personal user data
- **Google's Privacy Policy:** https://policies.google.com/privacy

### Google (Places API)
- **Purpose:** Finding nearby restaurants when you use the Restaurants feature
- **Data Shared:** Approximate location (latitude/longitude) — only when you grant location permission
- **Google's Privacy Policy:** https://policies.google.com/privacy

### Google Analytics
- **Purpose:** Consent-based website traffic, source/referrer, page engagement, and app-store/support/social click measurement
- **Data Shared:** Sanitized page group, referrer origin, browser/device information, approximate geography, pseudonymous client/session identifiers, allowlisted custom click-event values, and fixed public outbound-link destinations if Google's Enhanced Measurement is enabled
- **Data NOT Shared:** Nomfly account data, meal preferences, grocery lists, recipe content, payment information, raw deep-link identifiers, or visitor-supplied page URL query values. Fixed public app-store campaign parameters may appear in outbound-link measurement.
- **Privacy Controls:** The Google tag does not load until you choose "Allow analytics." Advertising storage, Google Signals, ad personalization, and cross-site advertising use are disabled.
- **Google's Privacy Policy:** https://policies.google.com/privacy

### Plausible Analytics (Current Mobile Builds)
- **Purpose:** One-time first-open activation measurement from some currently distributed mobile app versions
- **Data Shared:** Request IP address, app platform/version/build, and optional Google Play campaign source/medium/campaign values
- **Data NOT Shared:** Nomfly account data, meal preferences, grocery lists, recipe content, payment information, or detailed app activity
- **Plausible's Data Policy:** https://plausible.io/data-policy

### USDA (FoodData Central)
- **Purpose:** Nutrition information for recipes
- **Data Shared:** Ingredient names (no personal data)

## 3. How We Use Your Information

- **Personalization:** Your taste profile and meal history are used to improve AI-powered meal suggestions over time
- **Core Functionality:** Saved recipes, collections, grocery lists, household coordination
- **Analytics:** Website and app usage trends to improve Nomfly and understand which pages and campaigns are working

We do **NOT**:
- Sell your personal data to anyone
- Use your data for advertising or ad targeting
- Share your data with data brokers
- Track you across other apps or websites

## 4. Data Storage & Security

- **Backend:** AWS (us-east-1) — PostgreSQL database with encryption at rest (AES-256)
- **Transit:** All data transmitted via TLS 1.3
- **Authentication:** AWS Cognito with JWT tokens
- **Local Storage:** Taste profile and preferences stored on your device for offline access
- **Fridge Photos:** Never stored server-side — processed in memory and discarded

## 5. Data Retention

- **Account Data:** Retained until you delete your account
- **Meal History:** Retained until you delete your account
- **Taste Profile:** Retained until you delete your account
- **Fridge Photos:** Not retained — processed and discarded immediately
- **AI-Generated Images:** Stored in AWS S3 indefinitely (not linked to your identity)
- **Website Analytics Cookies:** Created only after consent, configured to expire after no more than 90 days without renewal, and deleted when you withdraw consent through Analytics choices

## 6. Your Rights

### All Users
- **Access:** Export all your data in JSON format (Profile > Privacy & Data > Export My Data)
- **Deletion:** Delete your account and all associated data (Profile > Privacy & Data > Delete Account) or review account deletion instructions at https://www.nomfly.com/account-deletion/
- **AI Consent:** Revoke AI data sharing anytime (Profile > Privacy & Data > AI Data Sharing toggle)
- **Website Analytics Choice:** Allow, decline, or withdraw Google Analytics consent using "Analytics choices" in the website footer
- **Correction:** Update your profile, preferences, and dietary restrictions anytime

### GDPR (EU/EEA Users)
You have additional rights under GDPR including the right to data portability, right to restriction of processing, and right to object. The supervisory authority for EU data protection is your local Data Protection Authority. Contact us at support@nomfly.com.

### UK GDPR (United Kingdom Users)
Your rights under UK GDPR are substantially similar to EU GDPR. The supervisory authority is the Information Commissioner's Office (ICO). Contact us at support@nomfly.com.

### CCPA (California Users)
You have the right to know what data we collect, request deletion, and opt out of data sales. We do not sell personal information. Contact us at support@nomfly.com.

### PIPEDA (Canada Users)
We comply with Canada's Personal Information Protection and Electronic Documents Act. You have the right to access, correct, and withdraw consent for your personal information. Contact us at support@nomfly.com.

### APPI (Japan Users)
We comply with Japan's Act on the Protection of Personal Information. Your data is transferred to the United States where our servers are located. We ensure equivalent data protection safeguards are in place. Contact us at support@nomfly.com.

## 7. International Data Transfers

If you access Nomfly from outside the United States, your personal data may be transferred to and processed in the United States by us and the service providers listed above. We use appropriate contractual and technical safeguards where required.

## 8. Website Analytics Choices and Cookies

Nomfly uses Basic Consent Mode. Google Analytics is not loaded and analytics cookies are not created unless you choose "Allow analytics." Choosing "No thanks" keeps analytics off. You can reopen "Analytics choices" in the website footer at any time; withdrawing consent deletes Google Analytics cookies and prevents the tag from loading on future pages. The small local-storage value that remembers your choice is used only to honor that preference.

To reduce collection, Nomfly's custom analytics sends only allowlisted website page groups and click categories. The Google tag is not loaded on arbitrary 404 routes or app deep-link routes, so recipe, decision, share, and visitor-supplied page query identifiers are not sent to Google Analytics.

## 9. Children's Privacy

Nomfly is not directed at children under 13. We do not knowingly collect personal information from children under 13. Users must confirm they are 13 years or older during account creation. If you believe a child under 13 has provided us personal information, contact us at support@nomfly.com.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes via in-app notification or email. Continued use of the app after changes constitutes acceptance.

## 11. Contact Us

For privacy questions or to exercise your rights:
- **Email:** support@nomfly.com
- **Website:** https://www.nomfly.com/privacy/
- **Mail:** Tapwise Digital LLC, 4030 Wake Forest Road, STE 349, Raleigh, NC 27609, USA
