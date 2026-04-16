# Nomfly Privacy Policy

**Last Updated: April 14, 2026**

Tapwise Digital LLC ("we," "us," or "our") operates the Nomfly mobile application. This Privacy Policy explains how we collect, use, and share your personal information.

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
- **Usage Data:** Decision counts, feature usage patterns, session frequency
- **Device Information:** iOS version, device model (for compatibility only)

### Information Processed Temporarily
- **Fridge Photos:** When you use the fridge scan feature, your photo is sent to Anthropic's Claude Vision API for ingredient identification. The photo is NOT stored on our servers. It is transmitted via encrypted connection (TLS 1.3), processed, and discarded.

## 2. Third-Party AI Providers

Nomfly uses third-party AI services to power core features. **We explicitly disclose these providers and what data they receive:**

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

### USDA (FoodData Central)
- **Purpose:** Nutrition information for recipes
- **Data Shared:** Ingredient names (no personal data)

## 3. How We Use Your Information

- **Personalization:** Your taste profile and meal history are used to improve AI-powered meal suggestions over time
- **Core Functionality:** Saved recipes, collections, grocery lists, household coordination
- **Analytics:** Aggregate, anonymized usage data to improve the app (no individual tracking)

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

## 6. Your Rights

### All Users
- **Access:** Export all your data in JSON format (Profile > Privacy & Data > Export My Data)
- **Deletion:** Delete your account and all associated data (Profile > Privacy & Data > Delete Account)
- **AI Consent:** Revoke AI data sharing anytime (Profile > Privacy & Data > AI Data Sharing toggle)
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

If you access Nomfly from outside the United States, your personal data will be transferred to and processed in the United States, where our servers and AI providers (Anthropic, OpenAI) are located. By using the App, you consent to this transfer. We use Standard Contractual Clauses (SCCs) and Data Processing Agreements (DPAs) with our AI providers to ensure adequate data protection for international transfers.

## 9. Children's Privacy

Nomfly is not directed at children under 13. We do not knowingly collect personal information from children under 13. Users must confirm they are 13 years or older during account creation. If you believe a child under 13 has provided us personal information, contact us at support@nomfly.com.

## 10. Changes to This Policy

We may update this Privacy Policy from time to time. We will notify you of material changes via in-app notification or email. Continued use of the app after changes constitutes acceptance.

## 11. Contact Us

For privacy questions or to exercise your rights:
- **Email:** support@nomfly.com
- **Website:** https://www.nomfly.com/privacy
- **Mail:** Tapwise Digital LLC, 4030 Wake Forest Road, STE 349, Raleigh, NC 27609, USA
