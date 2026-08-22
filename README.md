# Scentlyn Home Essentials

Scentlyn — Prototype Improvement & Long-Term E-Commerce Direction

I already have an existing Scentlyn prototype at:

https://scentlyn-clean-shop.vercel.app/

Do NOT completely redesign or rebuild the project from scratch.

First, review the existing prototype carefully and understand its current layout, visual identity, components, navigation, product presentation and overall user experience.

Then improve and restructure the existing prototype so that it aligns with the following long-term vision.

1. CORE BUSINESS DIRECTION

Scentlyn should NOT feel like a laundry-only store.

Laundry is the starting category, but the long-term brand is about:

Scent • Freshness • Cleaning • Home Care • A beautifully cared-for home

The website architecture should therefore be built as a flexible e-commerce platform that can start with the products currently available and gradually expand into additional household categories without requiring a major redesign later.

The customer experience should remain:

Simple on the surface, flexible behind the scenes.

The website should feel:

Premium

Clean

Fresh

Elegant

Modern

Minimal

Product-focused

Easy to navigate

Mobile-first

Do not overcrowd the interface.

2. MAIN NAVIGATION

Simplify the primary navigation to only these five major sections:

LAUNDRY | HOME CARE | SCENTS | BATHROOM | KITCHEN

Do not display every subcategory in the main navigation.

The customer should first select one of these five sections and then see the relevant products and subcategories.

For example:

LAUNDRY

Potential subcategories:

Laundry Pods

Liquid Detergent

Scent Boosters

Fabric Softeners

Stain Removers

Whites & Fabric Care

Colour Catchers

Machine Care

Laundry Accessories

HOME CARE

Potential products/categories:

General household cleaners

Surface cleaners

Cleaning aids

Household maintenance products

SCENTS

Potential products/categories:

Scented Candles

Air Fresheners

Diffusers

Linen Scents

Wardrobe Scents

Other Home Fragrance Products

BATHROOM

Potential products/categories:

Toilet Cleaners

Toilet Bleach

Toilet Fresheners

Bathroom Cleaners

Bathroom Scents

KITCHEN

Potential products/categories:

Kitchen Cleaners

Degreasers

Surface Cleaners

Dishwasher Products

Kitchen Cleaning Aids

These categories do not all need to contain products immediately.

Build the architecture so empty/future categories can be introduced later without changing the overall website structure.

3. HOMEPAGE

The homepage should immediately communicate what Scentlyn is.

Do not overload the homepage with every product category.

Create a premium, clean homepage hierarchy:

Header/navigation

Strong hero section

Short Scentlyn value proposition

Five main shopping categories

Featured products / Best Sellers

Optional promotional section

Why Scentlyn / trust section

Simple footer

The five main categories should be visually attractive but minimal:

Laundry Home Care Scents Bathroom Kitchen

The user should be able to click a category and enter that shopping section.

The homepage should feel more like a premium modern household-products brand than a traditional laundry shop.

4. SEARCH

Add a prominent but elegant search function.

Customers should be able to search directly for products.

Examples:

Vanish

Ariel

Lenor

Elbow Grease

Colour Catcher

Search should return relevant products even when the customer doesn't know which category they belong to.

The search experience should work particularly well on mobile.

Include:

Search icon

Search field

Product suggestions/results

Product image

Product name

Price

Available size/variant

Quick access to product page

5. PRODUCT ARCHITECTURE

This is extremely important.

Do NOT create a separate product listing for every size or pack quantity.

A product should have variants.

Example:

Ariel Pods

Variants:

22 pods

33 pods

50 pods

58 pods

The customer opens one Ariel Pods product page and selects the desired variant.

When the variant changes:

Price updates

Stock/availability can update

Quantity selector remains available

This structure should also support:

ml

litres

grams

kilograms

number of pods

number of pieces

pack quantities

Example:

Product: Fabric Softener

Size: 500ml 1L 2L

or

Product: Laundry Pods

Pack: 22 pods 33 pods 50 pods

The underlying product structure should make it easy to add new variants later.

6. PRODUCT PAGE

Improve the product page so that it is clean and conversion-focused.

Include:

High-quality product image

Product name

Short description

Price

Variant/size selector

Quantity selector

Stock/availability

BUY NOW / ADD TO CART

ORDER VIA WHATSAPP

Product details

Delivery information

Related products

The WhatsApp option is important.

If a customer clicks WhatsApp from a specific product, generate a pre-filled WhatsApp message such as:

"Hi Scentlyn, I'd like to enquire about Ariel Pods – 33 Pods."

The exact product name and selected variant should be included automatically where possible.

7. TWO CLEAR ORDERING PATHS

Scentlyn needs two equally clear customer journeys.

OPTION 1 — BUY NOW / ONLINE CHECKOUT

For customers who already know what they want.

Journey:

Product → Select Variant → Quantity → Add to Cart → Checkout → Delivery Details → Payment → Order Confirmation

The checkout must NOT require account creation.

Allow guest checkout.

Collect:

Full name

Phone number

Delivery location/address

Delivery option

Order summary

Product

Selected size/variant

Quantity

Delivery fee

Total amount

Payment method

Payment methods should be structured to support:

M-Pesa | Visa/Card | Cash on Delivery

Some payment methods may be implemented later.

Design the checkout architecture so additional payment methods can be added without rebuilding the entire checkout.

8. M-PESA / PAYMENT ARCHITECTURE

For the current prototype, do NOT pretend that real payments are already connected if they aren't.

Build the interface and architecture in a way that can later support payment integration.

The system should separate:

Cart

Checkout

Order creation

Payment method

Payment status

Order confirmation

This should make it possible to integrate M-Pesa or another payment provider later.

For the prototype, use clearly labelled mock/demo payment states if necessary.

Do not expose API keys or sensitive payment credentials in frontend code.

9. WHATSAPP ORDERING

WhatsApp should remain an important secondary ordering path.

Add:

ORDER VIA WHATSAPP

in appropriate locations.

Use it on:

Product pages

Potentially product cards

Contact section

Mobile interface

When clicked from a product, automatically create a pre-filled message containing the product name and selected variant.

Example:

"Hi Scentlyn, I'm interested in Ariel Pods – 33 Pods. Is it available?"

Make the experience extremely easy.

10. CART

Create a clean shopping cart.

Each cart item should display:

Product image

Product name

Selected variant

Quantity

Unit price

Total price

Remove option

The cart should automatically calculate:

Subtotal

Delivery fee

Total

Keep the cart visually simple.

11. CHECKOUT

The checkout should be short and frictionless.

Do NOT force:

Account creation

Login

Long forms

Unnecessary personal information

The goal is to allow someone coming from Instagram or TikTok to complete an order quickly.

Use a clear structure such as:

Contact

Full Name Phone Number

Delivery

Location / Address Delivery Option

Payment

M-Pesa Card Cash on Delivery

Order Summary

Products Quantity Variants Subtotal Delivery Total

Place Order

Then show a simple order confirmation screen.

12. PRODUCT COLLECTIONS

The architecture should eventually support collections such as:

Best Sellers

New Arrivals

Promotions

Laundry Bundles

Starter Kits

However, do not clutter the homepage with all of these.

They should be secondary discovery mechanisms.

13. MOBILE-FIRST EXPERIENCE

A large portion of Scentlyn's customers may come from Instagram and TikTok.

Therefore, prioritize mobile.

Make sure:

Navigation is easy to use on small screens

Search is easy to access

Product images look excellent

Buttons are large enough to tap

Cart is easy to access

Checkout is simple

WhatsApp ordering is highly visible

Pages load quickly

No unnecessary animations slow down the experience

The mobile version should feel like a premium shopping app.

14. VISUAL DESIGN

Keep the existing Scentlyn visual identity where appropriate, but refine it.

The design direction should communicate:

Freshness + Premium Home Care + Modern Lifestyle

Avoid making it look like:

A generic supermarket

A basic laundry service website

An overcrowded marketplace

A template with too many sections

Use:

Generous whitespace

Strong typography

Beautiful product photography

Clean cards

Subtle borders/shadows

Elegant buttons

Consistent spacing

Premium visual hierarchy

Products should be the visual focus.

Do not use excessive gradients, animations or decorative elements.

15. INFORMATION ARCHITECTURE

Build the system with a scalable structure.

Think in terms of:

Category → Subcategory → Product → Variant → Cart → Checkout → Order

For example:

Laundry → Laundry Pods → Ariel Pods → 22 / 33 / 50 / 58 Pods

This should allow Scentlyn to add hundreds of products later without changing the core structure.

16. FUTURE EXPANSION

The current inventory may mostly be laundry products.

That is completely fine.

Do NOT fill the prototype with fake products just to make every category look complete.

Instead:

Use the real/current products where available

Build the category architecture for future expansion

Clearly design empty/future categories where necessary

Make it easy to add products later

The prototype should demonstrate the future Scentlyn ecosystem, not pretend that the business already stocks everything.

17. IMPORTANT TECHNICAL REQUIREMENT

Before changing anything, inspect the existing project and preserve:

Existing good components

Existing branding

Existing working functionality

Existing product data where useful

Existing responsive behavior

Refactor where necessary rather than unnecessarily rewriting everything.

Use reusable components for:

Header

Navigation

Category cards

Product cards

Product variants

Cart

Checkout

Buttons

Product sections

Footer

Avoid hardcoding every product page individually.

Products, categories and variants should ideally be represented as structured data so new products can easily be added later.

18. DO NOT OVERBUILD THE CURRENT PROTOTYPE

This is still a prototype.

Do not attempt to build a complete enterprise e-commerce backend right now.

Focus on demonstrating:

Premium Scentlyn brand experience

Five-category structure

Search

Product variants

Product pages

Cart

Guest checkout flow

WhatsApp ordering

Future-ready product architecture

Mobile-first experience

Use mock/demo states where backend functionality is not yet connected.

Clearly separate prototype functionality from functionality that will require backend/payment integration later.

19. FINAL CUSTOMER JOURNEY

The ideal customer journey should be:

Instagram / TikTok ↓ Scentlyn website ↓ Immediately understand the brand ↓ Choose:

LAUNDRY | HOME CARE | SCENTS | BATHROOM | KITCHEN

OR

Search directly for a product ↓ Open product ↓ Select size/variant ↓ Choose:

🛒 BUY NOW

OR

💬 ORDER VIA WHATSAPP

If buying:

Cart ↓ Guest Checkout ↓ Delivery Details ↓ Payment ↓ Order Confirmation

The entire experience should feel effortless.

20. MOST IMPORTANT DESIGN PRINCIPLE

Build Scentlyn so that the customer sees simplicity while the underlying architecture remains flexible.

The customer should think:

"I know exactly where to go."

The business should be able to think:

"We can add another 100 products and new categories without redesigning the website."

Start by analyzing the existing prototype at:

https://scentlyn-clean-shop.vercel.app/

Then improve the existing prototype according to this direction.

Do not destroy the current design unnecessarily.

First identify what is already working well, then make the minimum structural and visual changes needed to move Scentlyn toward this long-term vision.

The final result should look like a serious, premium, scalable Kenyan home-care e-commerce brand — not simply a laundry product catalogue.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://scentlyn-home-essentials.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/4fe80916-4673-4450-93a2-9a323c6aa391).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
