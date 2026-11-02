# QuickBite — Reference Design Specification

## Design authority
The user-supplied 12-screen montage is the authoritative visual reference. It must be reconstructed screen by screen. The goal is high visual fidelity, not a generic redesign.

The available reference is a montage rather than the original design source. Therefore, measured values must be derived from the actual image crops and implementation comparisons. Do not claim to know the original CSS or exact source pixel values.

## Visual direction
- Premium dark espresso/near-black foundation.
- Warm amber/orange accents.
- Warm white primary text.
- Muted warm secondary text.
- Dark elevated cards and subtle bronze borders.
- Rounded controls and restrained depth.
- Premium, realistic food photography.
- Burger-inspired QuickBite branding.
- Cohesive typography, spacing and iconography.

## Initial design tokens
| Token | Starting value |
|---|---|
| Main background | `#100B08` |
| Secondary background | `#18110D` |
| Elevated card | `#211710` |
| Input background | `#261B14` |
| Primary accent | `#FF981F` |
| Accent highlight | `#FFB34D` |
| Deep accent | `#C96813` |
| Primary text | `#FFF8F0` |
| Secondary text | `#B9AAA0` |
| Muted text | `#82746A` |
| Border | `#493326` |
| Success | `#42C77A` |
| Error | `#F06A61` |

These are proposed calibration tokens, not extracted original CSS values.

## Measurement and calibration
Baseline viewport: 390 × 844 CSS pixels.

Additional widths: 320, 360, 430, 768, 1024 and 1440 CSS pixels.

For every screen:
1. Extract/crop the corresponding reference screen.
2. Record screen bounds.
3. Measure normalized X, Y, width and height for important components.
4. Record section order, alignment, spacing, image aspect ratio and crop.
5. Record typography hierarchy, colors, borders, radii and control dimensions.
6. Implement the screen.
7. Capture the same viewport and state.
8. Compare reference and implementation.
9. Fix material discrepancies.
10. Save evidence and record the result.

## Screen specifications

### 01 — Welcome
Logo and QuickBite name, tagline, decorative dark background, large burger hero photograph, “Delicious Food, Delivered Fresh” headline, Get Started, Sign In and Continue as Guest.

### 02 — Sign In
Centered branding, Welcome Back heading, email/password fields, Remember Me, Forgot Password, Sign In, Google/Apple options where configured, Sign Up navigation.

### 03 — Create Account
Branding, Full Name, Email, Phone Number, Password, Create Account, optional configured social signup and Sign In navigation.

### 04 — Home
Preserve this exact hierarchy: header with menu/logo/cart badge; featured banner; search; circular categories; Popular Items heading; horizontal product rows; secondary banner; bottom navigation. Preserve the reference banner's image/text balance.

### 05 — Menu
Header/title, search, category chips, two-column product grid, consistent product images, names, prices, add controls and bottom navigation.

### 06 — Product Details
Large product photo, back/favourite controls, name, genuine rating/review information if available, description, customization, quantity, price and Add to Cart.

### 07 — Cart
Header and clear action, product rows with thumbnails/name/price/quantity, subtotal, configured delivery fee, total, checkout button and bottom navigation.

### 08 — Checkout
Pickup/Delivery selection, supported payment methods, order notes, order summary and Place Order.

### 09 — Order Tracking
Order heading, genuine status timeline and timestamps, reference-style map illustration and ETA area. No false live GPS or fabricated ETA.

### 10 — My Orders
All/Completed/Cancelled filters, order cards with image, ID, total, status and date, bottom navigation.

### 11 — Admin Dashboard
Dark admin interface, vertical icon sidebar, heading/profile, Total Orders and Total Sales, sales chart/period selector and Recent Orders. All figures must come from real data.

### 12 — Manage Menu
Heading, Items/Categories tabs, product rows with images, names, prices, availability controls and Add Item.

## Image and photography standard
- Prefer high-quality, realistic food photography with consistent lighting and color treatment.
- Maintain a coherent visual identity across the library.
- Reuse the same source photograph for a product across Home, Menu, Details and Cart.
- Produce appropriate thumbnail, card, detail and hero variants.
- Use WebP/AVIF where suitable, responsive sizing, lazy loading and stable aspect ratios.
- Preserve focal food content when cropping.
- Provide loading placeholders and fallbacks.
- No stretching, watermarks, low-quality placeholders or unrelated images for the same product.

Suggested source targets: hero 1200×1000, banners 1400×650, category 500×500, product card 800×800. These are asset-production targets, not reference measurements.

## Visual acceptance
A screen passes only when:
- Its composition and section order match the reference.
- Major dimensions and spacing are calibrated.
- Images are high quality and correctly cropped.
- Typography, colors and controls are consistent.
- Responsive behavior does not damage the composition.
- A screenshot comparison is recorded.

Visual fidelity is a target to be demonstrated through evidence, not an unsupported claim of 100% pixel identity.
