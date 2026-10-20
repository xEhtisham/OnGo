---
name: Kinetic Pulse
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#464555'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#777587'
  outline-variant: '#c7c4d8'
  surface-tint: '#4d44e3'
  primary: '#3525cd'
  on-primary: '#ffffff'
  primary-container: '#4f46e5'
  on-primary-container: '#dad7ff'
  inverse-primary: '#c3c0ff'
  secondary: '#b52603'
  on-secondary: '#ffffff'
  secondary-container: '#fd5835'
  on-secondary-container: '#570c00'
  tertiary: '#005338'
  on-tertiary: '#ffffff'
  tertiary-container: '#006e4b'
  on-tertiary-container: '#67f4b7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2dfff'
  primary-fixed-dim: '#c3c0ff'
  on-primary-fixed: '#0f0069'
  on-primary-fixed-variant: '#3323cc'
  secondary-fixed: '#ffdad2'
  secondary-fixed-dim: '#ffb4a3'
  on-secondary-fixed: '#3d0600'
  on-secondary-fixed-variant: '#8c1900'
  tertiary-fixed: '#6ffbbe'
  tertiary-fixed-dim: '#4edea3'
  on-tertiary-fixed: '#002113'
  on-tertiary-fixed-variant: '#005236'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 64px
    letterSpacing: -0.03em
  display-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '800'
    lineHeight: 44px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
    letterSpacing: -0.005em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: '0'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: '0'
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  caption-xs:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  gutter-lg: 2rem
  margin: 1rem
  margin-md: 2rem
  margin-lg: 3.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system targets urban event-goers, music enthusiasts, festival attendees, and cultural explorers seeking effortless discovery and high-trust ticket purchasing. The visual tone is electric yet sophisticated—pairing structural restraint with high-octane color accents. 

The aesthetic is Modern High-Contrast with Editorial Polish:
- **Quiet Scaffolding, Loud Content:** Crisp light-slate surfaces, architectural borders, and generous whitespace ensure vibrant, diverse event photography and artist key art remain the focal point.
- **Intentional Electric Energy:** Electric Indigo drives identity, navigation, and state feedback, while Sunset Coral is reserved strictly as a high-conversion transactional beacon for purchase and booking moments.
- **Physicality and Polish:** Clean rounded geometry, refined hairline borders, and atmospheric elevation evoke premium physical event passes and modern concierge digital products.

## Colors

The palette balances clinical legibility with vivid stage lighting accents.

- **Primary (`#4F46E5` - Electric Indigo):** The brand backbone. Governs active tabs, brand iconography, interactive badges, filter states, and primary discovery navigation.
- **Secondary (`#FF5A36` - Sunset Coral):** The transactional accelerator. Strictly gatekept for conversion endpoints: "Get Tickets", "Select Seats", "Complete Order", and urgent inventory micro-copy. Never dilute its urgency by using it on decorative backgrounds or generic elements.
- **Tertiary & Functional Accents:**
  - **Success (`#10B981` - Mint Emerald):** Confirmed checkouts, ticket transfers, verified badges, and on-sale alerts.
  - **Warning (`#F59E0B` - Amber Glow):** Low-ticket thresholds ("Only 12 tickets left"), impending queue timeouts, and waitlist markers.
  - **Error (`#EF4444` - Crimson Red):** Sold out banners, payment failures, and validation errors.
- **Surfaces & Neutral Spectrum:**
  - **Canvas Base:** `#F8FAFC` (Slate 50) delivers warmth and cuts screen glare compared to raw white.
  - **Surface Container (Cards & Modals):** `#FFFFFF` provides distinct elevation over the base canvas.
  - **Hairline Borders:** `#E2E8F0` (Slate 200) maintains crisp structural separation between dense metadata sets.
  - **Primary Ink:** `#0F172A` (Slate 900) ensures crisp contrast (APCA / WCAG AAA) for artist names and pricing tiers.
  - **Muted Ink:** `#64748B` (Slate 500) for timestamps, venue addresses, and secondary tags.

## Typography

The typography uses Plus Jakarta Sans throughout for clean, geometric modernism with high organic legibility.

- **Display & Headline Tiers (800 ExtraBold):** Headline roles demand intense visual presence to echo festival posters and headline billing. Negative tracking (`-0.02em` to `-0.03em`) tightens large character spacing, producing commanding title locks on discovery feeds.
- **Card Titles & Sections (600 - 700 SemiBold/Bold):** Used for event names, venue titles, and ticket category headers. High contrast against muted metadata maintains immediate scannability.
- **Body & Editorial (400 Regular):** Optimized line heights (`1.5` to `1.6`) ensure artist bios, event FAQs, and policies remain comfortable during long-form reading.
- **Labels & Micro-Data (600 SemiBold):** Applied to badges, chips, dates, times, and pricing badges with slight positive tracking (`+0.01em` to `+0.02em`) for instant reading at glance speeds.

## Layout & Spacing

A strictly disciplined 8pt spacing rhythm structures fluid discovery grids and linear checkout tunnels.

- **Grid Infrastructure:**
  - **Desktop (1200px+):** 12-column responsive fluid grid. Outer section margins set to `margin-lg` (3.5rem), internal gutters set to `gutter-lg` (2rem). Discovery card feeds layout in 3 or 4 columns.
  - **Tablet (768px - 1199px):** 8-column grid with `margin-md` (2rem) and `gutter` (1.5rem). Event cards layout in 2 columns.
  - **Mobile (< 768px):** 4-column grid or single-column stack with `margin` (1rem) safe bounds and `gutter-sm` (1rem). Horizontal scroll carousels "bleed" 16px past screen edges to reveal upcoming cards.
- **Density Guidelines:**
  - Use `space-xs` (4px) and `space-sm` (8px) for tightly coupled metadata pairs (e.g., calendar icon paired with event date).
  - Use `space-md` (16px) for inner card content padding and between form field groups.
  - Use `space-lg` (24px) for component card interior separation and modal body padding.
  - Use `space-xl` (40px) to divide unrelated browse sections (e.g., "Trending in Berlin" to "Recommended Venues").

## Elevation & Depth

Visual hierarchy combines low-contrast structural borders with soft, atmospheric ambient shadows that mimic natural stage luminescence.

- **Surface Level 0 (Canvas):** `#F8FAFC` flat background. No shadow.
- **Surface Level 1 (Default Cards & Static Panels):** `#FFFFFF` background bound by a 1px solid border in `#E2E8F0`. Shadow is faint and diffuse: `0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.04)`.
- **Surface Level 2 (Interactive Cards on Hover, Dropdowns & Popovers):** Elevated upon interaction. The border shifts subtly to `#CBD5E1`, with shadow: `0 10px 25px -5px rgba(15, 23, 42, 0.08), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`. A gentle `-2px` Y-axis translation reinforces tactile feedback.
- **Surface Level 3 (Sticky Bottom Ticket Bar, Modals, Drawer Sheets):** Pure `#FFFFFF` surface suspended over a high-translucency overlay (`rgba(15, 23, 42, 0.45)` with `backdrop-filter: blur(4px)`). Shadow: `0 20px 35px -10px rgba(15, 23, 42, 0.16)`.
- **Accent Glow (Transactional CTA Hover):** Sunset Coral CTA buttons gain a branded atmospheric aura: `0 8px 20px -4px rgba(255, 90, 54, 0.35)`.

## Shapes

The system relies on crisp, contemporary geometry (`roundedness: 2` scale) that yields soft yet structured corners.

- **Standard Containers & Cards (`rounded-lg` / 16px):** Event poster wrappers, content summary cards, venue profiles, and checkout summary blocks use a uniform 16px radius.
- **Interactive Controls & Inputs (`rounded` / 8px):** Form inputs, dropdown selectors, secondary buttons, quantity counters, and badge containers use an 8px radius for crisp interaction framing.
- **Micro-Elements & Badges (`rounded-sm` / 4px to 6px):** Date chips, seating section tags, and status dots leverage compact rounding to maximize internal text density.
- **Full Pill (`rounded-full`):** Category filter pills ("Concerts", "Festivals", "Nightlife"), user avatar frames, and live status indicators ("Happening Tonight") utilize pill geometry to differentiate from structural card layouts.

## Components

### Buttons
- **Transactional CTA (Sunset Coral #FF5A36):** High-priority actions ("Get Tickets", "Pay $84.00"). Solid coral fill, white text, 800 weight, 8px border-radius, minimum touch target 48px height. On hover: slight brighten and coral diffuse drop shadow.
- **Brand Primary (Electric Indigo #4F46E5):** Discovery actions ("Explore Lineup", "Follow Artist"). Solid indigo fill, white text, 600 weight.
- **Secondary / Ghost:** White background, 1px border `#E2E8F0`, `#0F172A` text. Hover state transforms background to `#F1F5F9`.

### Event Discovery Cards
- Composed of an upper media slot (16:9 or 4:5 aspect ratio) with a 16px top border-radius, hairline internal divider, and a padded content shelf below (`space-md`).
- Overlaid on the poster: top-left date badge (solid white pill with black bold text), top-right save/heart toggle (semi-transparent circle button with blur).
- Card base includes: event title (`headline-sm`, 2-line clamp), venue / city string (`muted text`), and an anchored bottom shelf with lowest ticket price on the left and a compact arrow or pill button on the right.

### Chips & Filter Pills
- Filter chips sit in a horizontal, swipeable track.
- Inactive: `#FFFFFF` fill, 1px `#E2E8F0` border, `#64748B` text, `rounded-full`, 36px height.
- Active: `#4F46E5` fill, `#FFFFFF` text, shadowless, bold typography.

### Input Fields & Selectors
- Background `#FFFFFF`, 1px border `#E2E8F0`, 8px radius, 44px standard height.
- Focus state: border shifts to `#4F46E5` accompanied by a 3px outer ring in `rgba(79, 70, 229, 0.15)`. No default browser outlines.
- Error state: border shifts to `#EF4444` with helper text rendered in Crimson Red.

### Sticky Booking Bar (Mobile Viewport)
- Anchored to bottom edge with high z-index.
- `#FFFFFF` surface with a 1px top border `#E2E8F0` and `0 -4px 12px rgba(15, 23, 42, 0.05)` elevation.
- Houses event price tier summary on left ("From $45.00 / person") and full-width Sunset Coral CTA on right.

### Ticket / Seat Tiers List
- Segmented container with `#E2E8F0` dividers between rows.
- Each row contains tier title, remaining availability alert (`#F59E0B` if < 20 left), pricing, and an enclosed plus/minus stepper component.