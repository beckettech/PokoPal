# Pokopia Guide - iOS App Store Setup Guide

## Prerequisites

- [ ] Mac with Xcode 15+ installed
- [ ] Apple Developer Account ($99/year)
- [ ] AdMob account (free) - https://admob.google.com
- [ ] RevenueCat account (free tier available) - https://www.revenuecat.com

## Step 1: Apple Developer Setup

1. Go to https://developer.apple.com/account
2. Create an App ID with bundle identifier: `com.bektech.pokopiaguide`
3. Enable capabilities:
   - In-App Purchase
   - Push Notifications (optional)

## Step 2: App Store Connect Setup

1. Go to https://appstoreconnect.apple.com
2. Create a new app:
   - Name: "Pokopia Guide"
   - Bundle ID: com.bektech.pokopiaguide
   - Primary Language: English

3. Create In-App Purchase:
   - Type: Non-Consumable
   - Product ID: `com.bektech.pokopiaguide.remove_ads`
   - Reference Name: "Remove Ads"
   - Price: $2.99 (Tier 3)
   - Description: "Remove all advertisements from Pokopia Guide"

## Step 3: AdMob Setup

1. Go to https://apps.admob.com
2. Add a new app:
   - App name: "Pokopia Guide"
   - Platform: iOS
   - (Don't link to App Store yet - do this after first submission)

3. Create ad units:
   - Banner: "Home Banner"
   - Note the ad unit ID (starts with `ca-app-pub-...`)

4. Update `src/lib/purchases.ts`:
   ```typescript
   production: {
     banner: 'ca-app-pub-YOUR-ID-HERE/YYYYYYYYYY',
   }
   ```

## Step 4: RevenueCat Setup

1. Go to https://app.revenuecat.com
2. Create a new project: "Pokopia Guide"
3. Add iOS app:
   - Bundle ID: com.bektech.pokopiaguide
   - Upload your App Store Connect API key

4. Create Entitlement:
   - Identifier: `pro`
   - Display Name: "Pro Features"

5. Create Offering:
   - Add package with Product ID: `com.bektech.pokopiaguide.remove_ads`
   - Link to `pro` entitlement

6. Get your API key:
   - Project Settings > API Keys > App Store Connect
   - Copy the key

7. Add to `.env.mobile`:
   ```
   NEXT_PUBLIC_REVENUECAT_API_KEY=your_api_key_here
   ```

## Step 5: Build and Test

### On a Mac:

```bash
# Install dependencies
npm install

# Build for mobile
npm run build:mobile

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

### In Xcode:

1. Select your development team
2. Configure signing & capabilities
3. Update Privacy Usage Descriptions in Info.plist:
   - `NSUserTrackingUsageDescription`: "We use this to show you relevant ads"
   - `NSAppTransportSecurity`: Allow arbitrary loads (if needed)

4. Build and run on simulator/device
5. Test ad loading and IAP flow

## Step 6: App Store Submission

1. Prepare screenshots for all required device sizes
2. Fill in App Store listing:
   - Description
   - Keywords
   - Support URL
   - Privacy Policy URL (required for ads)

3. Upload build via Xcode or Transporter
4. Submit for review

## Privacy Policy Requirements

Since the app uses ads and analytics, you need a privacy policy covering:
- What data is collected
- How it's used
- Third-party services (AdMob, RevenueCat)
- User rights

## Notes

- Test ads are shown by default in development
- RevenueCat handles receipt validation and subscription management
- Users can restore purchases on new devices

## Useful Commands

```bash
# Build web assets for mobile
npm run build:mobile

# Sync to iOS
npx cap sync ios

# Open Xcode
npx cap open ios

# Run on iOS simulator
npx cap run ios

# Update iOS project after dependency changes
npx cap update ios
```

## Resources

- [Capacitor iOS Docs](https://capacitorjs.com/docs/ios)
- [AdMob Plugin Docs](https://github.com/capacitor-community/admob)
- [RevenueCat Capacitor Docs](https://docs.revenuecat.com/docs/capacitor)
- [Apple App Store Guidelines](https://developer.apple.com/app-store/review/guidelines/)
