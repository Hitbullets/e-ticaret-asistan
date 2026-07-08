---
name: Editorial Growth
colors:
  surface: '#10141a'
  surface-dim: '#10141a'
  surface-bright: '#353940'
  surface-container-lowest: '#0a0e14'
  surface-container-low: '#181c22'
  surface-container: '#1c2026'
  surface-container-high: '#262a31'
  surface-container-highest: '#31353c'
  on-surface: '#dfe2eb'
  on-surface-variant: '#e0bfba'
  inverse-surface: '#dfe2eb'
  inverse-on-surface: '#2d3137'
  outline: '#a88a86'
  outline-variant: '#59413e'
  surface-tint: '#ffb4a9'
  primary: '#ffb4a9'
  on-primary: '#690002'
  primary-container: '#ff6b5a'
  on-primary-container: '#6d0002'
  inverse-primary: '#ae3025'
  secondary: '#dbc0c0'
  on-secondary: '#3d2c2d'
  secondary-container: '#554243'
  on-secondary-container: '#c9afaf'
  tertiary: '#54dcbc'
  on-tertiary: '#00382d'
  tertiary-container: '#00af91'
  on-tertiary-container: '#003a2f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad5'
  primary-fixed-dim: '#ffb4a9'
  on-primary-fixed: '#410001'
  on-primary-fixed-variant: '#8c1711'
  secondary-fixed: '#f8dcdc'
  secondary-fixed-dim: '#dbc0c0'
  on-secondary-fixed: '#261818'
  on-secondary-fixed-variant: '#554243'
  tertiary-fixed: '#74f9d7'
  tertiary-fixed-dim: '#54dcbc'
  on-tertiary-fixed: '#002019'
  on-tertiary-fixed-variant: '#005142'
  background: '#10141a'
  on-background: '#dfe2eb'
  surface-variant: '#31353c'
typography:
  display-xl:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  display-xl-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  section-padding: 80px
---

## Brand & Style

This design system is built on the narrative of the "Editor’s Desk"—a workspace where raw data is refined into polished results. It blends high-end editorial sophistication with a modern, high-conversion SaaS aesthetic. The personality is confident, transformative, and authoritative.

The visual style is **Contemporary Editorial**, characterized by high-contrast layout shifts (dark input areas vs. light output areas) and human-centric motifs. It uses "Markup" elements—hand-drawn arrows and marker-style highlights—to emphasize the AI’s active role in the creative process. The emotional goal is to make the user feel like they are upgrading their content from "raw" to "premium" with professional precision.

## Colors

The palette is anchored by a deep **Near-black Navy (#0D1117)**, providing a sophisticated, low-distraction canvas. 

- **Primary Accent (Coral/Salmon):** Used for critical conversion points, active navigation states, and the "Marker" highlighting effect. It represents action and transformation.
- **Secondary Highlight:** A soft, desaturated coral tint used as a background fill for text annotations, mimicking a highlighter pen on paper.
- **The Binary Logic:** A strict distinction is made between "Girdi" (Input) and "Çıktı" (Output). Input areas use dark surfaces with muted text to represent raw potential, while Output areas use crisp white surfaces with dark text to signify a finished, ready-to-publish product.

## Typography

This design system employs a classic "Serif for Headlines, Sans for UI" pairing to achieve an editorial feel.

- **Playfair Display** handles all high-level messaging. It should be used with tight letter-spacing for large displays to maintain a cohesive, "printed" appearance.
- **Inter** provides the functional backbone. It is used for all UI labels, body copy, and input fields to ensure maximum legibility and a modern software feel.
- **Markup Styling:** Specific words within headlines or body text may be wrapped in a `<span>` with a coral background and 0.125rem border-radius to simulate an editor's highlight.

## Layout & Spacing

The layout follows a **12-column fluid grid** for desktop and a **single-column stack** for mobile. 

- **The Comparison Card:** A signature layout element is the split-pane card. On desktop, this is a horizontal side-by-side (50/50 split). On mobile, it stacks vertically with the dark "Input" section on top and the white "Output" section below.
- **Rhythm:** An 8px baseline grid is used. Sections are generously padded (80px+) to allow the large serif typography to breathe.
- **Safe Zones:** Content containers have a maximum width of 1280px to prevent line lengths from becoming unreadable on ultra-wide monitors.

## Elevation & Depth

This design system prioritizes **Tonal Layering** over heavy shadows to maintain a clean, editorial look.

- **Surface Tiers:** The background is #0D1117. Secondary surfaces (like the "Input" side of cards) use #161B22. This subtle shift creates depth without the need for traditional drop shadows.
- **Glassmorphism:** Navigation bars use a backdrop-blur (20px) with a semi-transparent dark tint to maintain context while scrolling.
- **The Output Pop:** The "Output" card section uses a pure white background with a very soft, diffused shadow (0px 10px 30px rgba(0,0,0,0.2)) to make the result feel physically layered on top of the dark workspace.
- **Outlines:** Subtle 1px borders in #30363D are used to define boundaries on dark surfaces.

## Shapes

The shape language balances structural rigor with organic accents.

- **UI Elements:** Buttons and cards use a **0.5rem (8px)** corner radius (Level 2). This provides a modern, approachable feel that isn't overly aggressive or too rounded.
- **The "Sticker" Badge:** Statistical badges (e.g., "+34% Conversion") use a "scalloped" or "starburst" circular shape to mimic a physical quality seal or sticker.
- **Illustrative Accents:** Hand-drawn SVG motifs (arrows, underlines, "sparkles") should have a variable stroke width to look authentically sketched, contrasting against the geometric precision of the UI.

## Components

### Buttons
- **Primary:** Coral background (#FF6B5A) with high-contrast white or dark-navy text. Hover state involves a slight scale up (1.02x) and a brightness increase.
- **Secondary/Outline:** Transparent background with a 1px white or light-grey border. On hover, the border thickens or the background fills slightly.

### Cards
- **The Transformation Card:** A compound component with a left/dark pane and a right/light pane. The divider should be a clean vertical line.
- **Badge:** Circular or starburst badges in primary coral, positioned to "break" the container bounds of a card to create visual interest.

### Inputs
- **Dark Fields:** For the "Input" sections, fields are dark (#0D1117) with light-grey borders. Focus state uses a coral border-glow.

### Animations
- **Marker Sweep:** When a page or card loads, text highlights should "draw in" from left to right using a CSS clip-path animation.
- **Nav Underline:** Active navigation links feature a coral underline that slides into place from the previous active link.
- **Counter:** Statistical numbers in badges should count up from zero on scroll-reveal.