# Scentlyn storefront refinement

## Goal
Refine the existing storefront in place into a calm, editorial Scentlyn Laundrymart shopping experience while preserving the current catalogue, variants, cart, checkout, search, and routes.

## Implementation

### 1. Brand system and shared frame
- Replace the green-led palette with warm off-white, deep navy, refined blue, and restrained powder-blue semantic tokens, including dark-mode equivalents.
- Pair an editorial serif display face with the existing clean sans-serif UI typography.
- Rework the announcement bar to the approved delivery/original-products/secure-payments message.
- Rebuild the shared header hierarchy around the existing logo and an explicit SCENTLYN / LAUNDRYMART wordmark treatment, with search, wishlist, account, and basket icons; non-functional wishlist/account controls will be clearly labeled without inventing account behavior.
- Set the desktop primary navigation to exactly LAUNDRY, KITCHEN, TOILETRIES, FRAGRANCE. On mobile, use the same four choices in the full-screen menu with preserved search and basket access.
- Simplify the footer into a premium, compact brand/contact/shop/policy layout and keep WhatsApp as a subtle floating help action.

### 2. Homepage hierarchy
- Replace the split-card hero with an editorial image-led composition using the existing lifestyle photography and the approved headline, supporting copy, and two store-navigation CTAs.
- Present exactly four homepage category cards: Laundry, Kitchen, Toiletries, and Fragrance. These are merchandising labels over the current route/data model, so existing product category keys remain intact.
- Refine the featured-products section as “Shop the Scentlyn Edit.”
- Add a trusted-brand row derived only from brand names that exist in the catalogue.
- Rebuild “Why Shop Scentlyn?” around the four approved trust points.
- Introduce the “Clean is only the beginning.” brand story using existing lifestyle imagery.
- Remove placeholder customer reviews and unsupported promotional claims from the homepage.

### 3. Product discovery and buying flow
- Upgrade product cards with a stable editorial image area, brand/name/variant/price/availability hierarchy, wishlist feedback, and add-to-basket behavior while retaining the current first-available-variant logic.
- Restyle shop, category, product, cart, and checkout pages to match the new system without changing data ownership or payment behavior.
- Extend the existing optional variant model to support variant images and compare-at prices safely; current products continue using their product-image and current-price fallbacks because no such per-variant data exists today.
- Ensure product selection updates price, availability, and image where provided, and that the exact selected variant image/price is passed to the cart.
- Keep WhatsApp available as secondary assistance, never as the dominant purchase action.

### 4. Responsive and accessibility pass
- Use deliberate mobile header/menu/search layouts, two-column category and product grids, stable image ratios, touch-sized controls, truncation where needed, and no horizontal overflow.
- Preserve visible focus states, semantic labels, reduced-motion behavior, and subtle reveal/zoom/menu transitions.

### 5. Verification
- Verify homepage, all four primary category links, search, product variant selection, add-to-basket, cart persistence/details, and checkout navigation in the running app.
- Check desktop and phone widths for overflow and visual collisions, then run the project’s build/type checks through the standard validation harness.

## Technical notes
- No database, payment, authentication, generated integration, or admin changes.
- Existing `shop-data` remains the single catalogue source; no duplicate product catalogue will be introduced.
- “Toiletries” will use the current bathroom-category route and “Fragrance” the current scents route, with customer-facing labels changed only where needed. The existing Home Care data remains searchable and available in the all-products view, but will not appear in primary navigation or the four-card homepage category section.
