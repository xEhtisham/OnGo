---
name: Editorial Monolith
colors:
  surface: '#f9f9f7'
  surface-dim: '#dadad8'
  surface-bright: '#f9f9f7'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f4f4f2'
  surface-container: '#eeeeec'
  surface-container-high: '#e8e8e6'
  surface-container-highest: '#e2e3e1'
  on-surface: '#1a1c1b'
  on-surface-variant: '#444748'
  inverse-surface: '#2f3130'
  inverse-on-surface: '#f1f1ef'
  outline: '#747878'
  outline-variant: '#c4c7c7'
  surface-tint: '#5f5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1c1b1b'
  on-primary-container: '#858383'
  inverse-primary: '#c8c6c5'
  secondary: '#5e5e5e'
  on-secondary: '#ffffff'
  secondary-container: '#e4e2e2'
  on-secondary-container: '#646464'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#1b1c1c'
  on-tertiary-container: '#848484'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e5e2e1'
  primary-fixed-dim: '#c8c6c5'
  on-primary-fixed: '#1c1b1b'
  on-primary-fixed-variant: '#474646'
  secondary-fixed: '#e4e2e2'
  secondary-fixed-dim: '#c8c6c6'
  on-secondary-fixed: '#1b1c1c'
  on-secondary-fixed-variant: '#474747'
  tertiary-fixed: '#e3e2e2'
  tertiary-fixed-dim: '#c7c6c6'
  on-tertiary-fixed: '#1b1c1c'
  on-tertiary-fixed-variant: '#464747'
  background: '#f9f9f7'
  on-background: '#1a1c1b'
  surface-variant: '#e2e3e1'
typography:
  display-xl:
    fontFamily: Manrope
    fontSize: 56px
    fontWeight: '800'
    lineHeight: 60px
    letterSpacing: -0.04em
  display-xl-mobile:
    fontFamily: Manrope
    fontSize: 38px
    fontWeight: '800'
    lineHeight: 42px
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Manrope
    fontSize: 44px
    fontWeight: '800'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '800'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '800'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '700'
    lineHeight: 24px
    letterSpacing: -0.01em
  title-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: 0em
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: 0em
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: 0em
  body-sm:
    fontFamily: Manrope
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0.01em
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.02em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.04em
  label-sm:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  margin: 3rem
  margin-mobile: 1.25rem
  margin-tablet: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system embodies an uncompromising, print-inspired editorial aesthetic tailored for curated cultural events, performances, and high-caliber ticketing experiences. The visual identity bridges archival broadsheet typography with modern gallery minimalism.

Key brand attributes:
- **Atmosphere:** Cultivated, architectural, discerning, and deliberate. It avoids the gamified neon noise of mainstream ticketing aggregators in favor of gallery-grade restraint.
- **Audience:** Cultural patrons, event curators, design-literate urbanites, and ticket buyers who prioritize clarity, provenance, and artful curation.
- **Design Philosophy:** Minimalist Editorial. Visual impact is derived exclusively from scale, proportion, razor-sharp 1px dividers, and high-contrast typographic hierarchy. Form follows architectural structure; no gratuitous visual decoration, translucent blurs, or colored gradients are permitted.

## Colors

The palette is strictly achromatic and paper-inspired. Every tint and shade is calibrated to emulate heavy matte paper, cold-set printing ink, and steel framing.

### Palette Architecture
- **Primary Ink (`#111111`):** Applied to primary action surfaces, dominant headers, and key focal UI components.
- **Absolute Ink (`#000000`):** Reserved for ultra-dense display typography, heavy strokes, and active selected states.
- **Secondary Ink (`#525252`):** Primary body prose, secondary titles, and icon foregrounds.
- **Muted Charcoal (`#737373`):** Metadata, venue locations, timestamps, and active input labels.
- **Subtle Silver (`#A3A3A3`):** Disabled values, placeholder hints, and passive calendar rules.
- **Canvas Base (`#F7F7F5`):** The foundational page background—a warm, desaturated off-white paper finish.
- **Surface Layer (`#FFFFFF`):** High-priority cards, modal windows, elevated sheets, and ticket surfaces.
- **Secondary Surface (`#F0F0EE`):** Contrast rows, filter wells, pill tracks, and ticket stubs.
- **Subtle Rule (`#E5E5E5`):** The primary boundary line for grids, content rules, and card borders.
- **Structural Rule (`#D4D4D4`):** Active interactive borders, segmented control outlines, and focused boundaries.

Strict enforcement: Colored alerts, status hues, saturated accents, chromatic gradients, and tinted backdrops are prohibited. State differences must be rendered solely via inversion (black against white), line weight, or typographic changes.

## Typography

The typography system relies solely on **Manrope**, leveraging its geometric construction and distinct structural forms to generate architectural clarity.

### Typographic Rules
- **Display Weights (Weight 800):** Headings and event titles utilize an extra-bold weight with tight, negative letter spacing to project graphic punch reminiscent of Swiss poster design.
- **Body & Continuous Reading (Weight 400):** Body copy maintains open line spacing to ensure legibility across dense descriptions and performance schedules.
- **Labels & Metatags (Weights 500 & 600):** Captions, timestamps, ticket categories, and status indicators favor higher tracking and strict vertical alignment.
- **Case Sensitivity:** Structural metadata, categorizations, and ticket codes should frequently employ full uppercase typesetting (`text-transform: uppercase`) paired with `label-md` or `label-sm` sizing to accentuate the editorial ledger aesthetic.

## Layout & Spacing

The layout is grounded in a 12-column rigid modular grid on desktop and a structured 4-column framework on mobile devices, echoing physical broadsheet column architecture.

### Spatial Rhythm
- **Rhythm Unit:** Constructed around a strict 4px/8px internal spatial rhythm. Component heights and vertical intervals lock systematically to multiples of 4px.
- **Whitespace Allocation:** Whitespace functions as a primary structural element. Rather than filling empty regions, broad gutters and ample margins isolate high-priority listings, creating breathing room reminiscent of a gallery exhibition wall.
- **Desktop (>= 1024px):** 12-column fluid framework capped at 1440px max content width. 48px canvas margins, 24px column gutters.
- **Tablet (768px - 1023px):** 8-column layout with 32px canvas margins and 20px gutters.
- **Mobile (< 768px):** 4-column grid with 20px outer margin and 16px gutters. Elements span full width (4 cols) or half width (2 cols) without fractional offsets.

## Elevation & Depth

This design system explicitly rejects dimensional skeuomorphism, heavy drop shadows, and blurred optical materials. Spatial hierarchy is communicated through planar layering, tonal contrast, and crisp borders.

### Hierarchical Mechanics
- **Zero-Depth Baseline:** Flat surfaces rest directly on `#F7F7F5`. Elevated components do not cast diffuse drop shadows.
- **Structural Outlines:** Depth and separation between components are articulated via razor-thin 1px borders using `#E5E5E5` for resting states and `#D4D4D4` for active structural dividers.
- **Surface Shift:** When a card or sheet elevates in context, it transitions its surface color to pure `#FFFFFF`.
- **Micro-Shadow Exception:** For floating overlays (e.g., sticky booking bars, interactive dropdown menus, or contextual drawers), an ultra-sharp architectural shadow is applied with zero blur:
  - `box-shadow: 0 4px 0 0 #111111;`
  - This hard-edge contact cast enforces physical presence without synthetic diffusion.

## Shapes

Shapes across the platform are austere, structural, and restrained.

### Corner Radii Guidelines
- **Base Elements:** Input fields, buttons, standard tags, and cards have a strict corner radius of `2px` to `4px`.
- **Large Containers:** Modals, ticket vouchers, and image frames must not exceed a maximum corner radius of `6px`.
- **Absolute Avoidance:** Fully pill-shaped geometries (`border-radius: 9999px`) and circular iconography boundaries are prohibited, except for single-letter badges or pagination counter dots.
- **Notches & Vouchers:** Ticketing interfaces may utilize crisp 45-degree angled corner cutouts or semi-circular punch-out cutouts along divider rules to reference perforated paper tickets.

## Components

### Buttons
- **Primary:** Background `#111111`, text `#FFFFFF`, border 1px solid `#111111`, corner radius 2px. Hover state inverts to background `#FFFFFF`, text `#111111`.
- **Secondary:** Background transparent, text `#111111`, border 1px solid `#111111`, corner radius 2px. Hover state fills to background `#F0F0EE`.
- **Ghost/Tertiary:** Background transparent, text `#525252`, no border. Underlined on hover with a 1px solid `#111111` offset.
- **Scale:** All buttons adhere to fixed heights (Small: 36px, Medium: 44px, Large: 52px) with horizontal padding of 16px, 24px, and 32px respectively. Text is styled using `label-lg` or `label-md`.

### Chips & Filter Tags
- **Default State:** Background `#FFFFFF`, border 1px solid `#E5E5E5`, text `#525252`, radius 2px, padding 6px 12px.
- **Active State:** Background `#111111`, border 1px solid `#111111`, text `#FFFFFF`.
- **Hover State:** Border color shifts to `#D4D4D4`.

### Lists & Ledger Grids
- **Style:** Rows delineated by 1px solid horizontal dividers (`#E5E5E5`). No alternating zebra stripes.
- **Hover:** Row background transitions smoothly to `#F0F0EE`.
- **Layout:** High-density horizontal alignment. Event date/time anchored left in `label-md` (`#737373`), event title center-left in `title-md` (`#111111`), venue details center-right in `body-sm` (`#525252`), and ticket action fixed right.

### Checkboxes & Radio Buttons
- **Checkbox:** 18x18px square with 2px radius. Unchecked: border 1px solid `#D4D4D4`, background `#FFFFFF`. Checked: background `#111111`, border `#111111`, displaying a crisp white 1.5px checkmark.
- **Radio:** 18x18px outer boundary with 2px radius (subtle square radio convention) or circle with checked center filled with an 8x8px solid `#111111` block.

### Input Fields
- **Container:** Height 48px, background `#FFFFFF`, border 1px solid `#E5E5E5`, radius 2px, padding 0 16px.
- **Typography:** `body-md` for user entry (`#111111`), placeholder in `#A3A3A3`.
- **Focus State:** Border shifts to 1px solid `#111111`. No glow, ring, or box-shadow halo.
- **Error State:** Border shifts to 1px solid `#111111` with an appended asterisk or bold label notification beneath the field in `label-sm` (`#111111`).

### Cards & Event Discovery Units
- **Container:** Background `#FFFFFF`, 1px solid `#E5E5E5`, radius 4px, overflow hidden.
- **Image Integration:** Aspect ratio locked to 16:9 or 4:5 portrait. Imagery renders in raw, unfiltered editorial high contrast; no gradient overlay cards are allowed.
- **Content Padding:** `space-md` (16px) or `space-lg` (24px).
- **Structure:** Headline locked at `headline-sm` or `title-md`, secondary location/date metadata locked beneath in `label-md` (`#737373`).

### Ticket Stub Component
- A dedicated two-part container separated by a dashed 1px perforation rule (`#D4D4D4`).
- **Left (Main Body):** Event details, seat tier, date, and access instructions on `#FFFFFF`.
- **Right (Stub):** Barcode/QR code container rendered on `#F0F0EE` with punch-out radial semi-circle notches aligned along the perforation axis.