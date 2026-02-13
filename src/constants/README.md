# Constants

Centralized constants for the entire application.

## Structure

```
constants/
├── index.ts         # Main export file
├── auth.ts          # Authentication (Login, Register, OAuth)
├── profile.ts       # User profile and account settings
├── seller.ts        # Seller verification and limits
├── payment.ts       # Payment, banks, QR codes
└── homepage.ts      # Homepage content (categories, stats, features)
```

## Usage

### Import from centralized location

```typescript
// ✅ Good - Import from @/constants
import { 
  loginFeatures, 
  registerFeatures,
  PASSWORD_MIN_LENGTH,
  PROFILE_MESSAGES 
} from "@/constants";

// ❌ Bad - Import from feature-specific constants
import { loginFeatures } from "@/components/feature/login/constants";
```

### Available Constants

#### Auth (`auth.ts`)
- `getGoogleLoginUrl()` - Generate Google OAuth URL
- `loginFeatures` - Login page features array
- `registerFeatures` - Register page features array

#### Profile (`profile.ts`)
- `PROFILE_TABS` - Profile tab IDs
- `PASSWORD_MIN_LENGTH` - Minimum password length (6)
- `PROFILE_MESSAGES` - All profile-related messages

#### Seller (`seller.ts`)
- `UNVERIFIED_SELLER_PRODUCT_LIMIT` - Product limit for unverified sellers (5)
- `becomeSellerFeatures` - Become seller features array

#### Payment (`payment.ts`)
- `PAYMENT_WINDOW_MINUTES` - Payment timeout (15 minutes)
- `BANK_CODE_MAP` - Bank name to code mapping
- `getBankCode(bankName)` - Get bank code from name
- `generateVietQRImageUrl(bankInfo)` - Generate VietQR image URL
- `formatCountdown(seconds)` - Format countdown timer (MM:SS)

#### Homepage (`homepage.ts`)
- `categories` - Product categories
- `stats` - Platform statistics
- `features` - Platform features
- `steps` - How it works steps

## Migration from Old Constants

Old constants files in feature folders are kept for backward compatibility:
- `/components/feature/login/constants.ts` → Re-exports from `@/constants/auth`
- `/components/feature/register/constants.ts` → Re-exports from `@/constants/auth`
- `/components/feature/profile/constants.ts` → Re-exports from `@/constants/profile`
- `/components/feature/become-seller/constants.ts` → Re-exports from `@/constants/seller`
- `/components/feature/payment/constants.ts` → Re-exports from `@/constants/payment`
- `/components/feature/homepage/constants.ts` → Re-exports from `@/constants/homepage`

**These old files are deprecated and will be removed in future versions.**

## Benefits

✅ **Single source of truth** - All constants in one place
✅ **Easy to find** - No need to search in feature folders
✅ **Prevent duplication** - Reuse constants across features
✅ **Better organization** - Grouped by domain
✅ **Type-safe** - Full TypeScript support
✅ **Easy maintenance** - Update once, reflect everywhere

## Adding New Constants

1. Choose the appropriate domain file (`auth.ts`, `profile.ts`, etc.)
2. Add your constant with proper JSDoc comments
3. Export from `index.ts` if needed
4. Update this README

Example:

```typescript
// In constants/profile.ts

/**
 * Maximum profile image size in bytes (5MB)
 */
export const MAX_AVATAR_SIZE = 5 * 1024 * 1024;
```
