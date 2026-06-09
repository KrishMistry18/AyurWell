---
name: Modern Ayurvedic Harmony
colors:
  surface: '#fefae0'
  surface-dim: '#dedbc2'
  surface-bright: '#fefae0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f4db'
  surface-container: '#f2efd5'
  surface-container-high: '#ede9cf'
  surface-container-highest: '#e7e3ca'
  on-surface: '#1d1c0d'
  on-surface-variant: '#404943'
  inverse-surface: '#323120'
  inverse-on-surface: '#f5f1d8'
  outline: '#707973'
  outline-variant: '#bfc9c1'
  surface-tint: '#2c694e'
  primary: '#0f5238'
  on-primary: '#ffffff'
  primary-container: '#2d6a4f'
  on-primary-container: '#a8e7c5'
  inverse-primary: '#95d4b3'
  secondary: '#765a05'
  on-secondary: '#ffffff'
  secondary-container: '#ffd87c'
  on-secondary-container: '#795d08'
  tertiary: '#274f3d'
  on-tertiary: '#ffffff'
  tertiary-container: '#3f6754'
  on-tertiary-container: '#b8e3cb'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b1f0ce'
  primary-fixed-dim: '#95d4b3'
  on-primary-fixed: '#002114'
  on-primary-fixed-variant: '#0e5138'
  secondary-fixed: '#ffdf96'
  secondary-fixed-dim: '#e7c268'
  on-secondary-fixed: '#251a00'
  on-secondary-fixed-variant: '#5a4400'
  tertiary-fixed: '#c1ecd4'
  tertiary-fixed-dim: '#a5d0b9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#274e3d'
  background: '#fefae0'
  on-background: '#1d1c0d'
  surface-variant: '#e7e3ca'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 24px
  section-gap: 80px
---

## Brand & Style
The design system embodies the concept of "Ancient Wisdom meets Modern Science." It balances the organic, holistic traditions of Ayurveda with the precision and clarity of contemporary wellness technology. The visual language is premium and aspirational, moving away from clinical coldness toward a warm, inviting, and trustworthy atmosphere.

The style is a sophisticated blend of **Minimalism** and **Glassmorphism**, grounded by **Tactile** textures. We use expansive whitespace to evoke a sense of "Prana" (breath/life force), while subtle grain overlays and faint geometric mandala patterns provide a physical, parchment-like quality that honors historical manuscripts. This juxtaposition ensures the interface feels both grounded in heritage and effortlessly modern.

## Colors
The palette is rooted in the natural world and traditional Ayurvedic ingredients.
- **Primary (Forest Green):** Represents vitality and herbal medicine. Used for main actions and brand presence.
- **Secondary (Turmeric Gold):** Acts as an accent for highlights, progress indicators, and premium call-outs.
- **Background (Warm Parchment):** Replaces pure white for the main canvas to reduce eye strain and provide a "natural" paper feel.
- **Dark Accent (Deep Forest):** Provides high-contrast depth for typography and grounding elements.
- **Surface (White):** Reserved for card elements and elevated containers to create clear separation from the parchment background.

## Typography
The typography strategy uses high-contrast serif headlines for an editorial, premium feel, paired with a functional sans-serif for optimal readability in data-rich areas.

- **Headlines:** Playfair Display provides an authoritative yet elegant voice. It should be used for page titles, section headers, and quotes.
- **Body & Labels:** Inter ensures that "Modern Science" is represented through clarity and precision. Use Inter for all functional text, instructions, and navigation.
- **Styling:** Larger headlines benefit from slight negative letter-spacing, while labels use expanded tracking and uppercase styling to denote hierarchy without increasing font size.

## Layout & Spacing
The layout follows a **Fluid Grid** model to maintain flexibility across devices while prioritizing generous "breathing room."

- **Desktop:** A 12-column grid with a maximum content width of 1280px. Gutters are kept wide (24px) to prevent the UI from feeling cramped or "clinical."
- **Mobile:** A 4-column grid with 20px side margins. 
- **Rhythm:** Vertical rhythm is built on an 8px base unit. Section spacing should be aggressive (80px+) to maintain an aspirational, calm flow that encourages mindful scrolling.

## Elevation & Depth
Depth is handled through a combination of **Glassmorphism** and **Ambient Shadows**.

1.  **Surfaces:** Main content containers use solid white with a "2xl" corner radius.
2.  **Overlays:** Modals, navigation bars, and floating action panels use a backdrop-blur (12px - 20px) with a semi-transparent white fill (80% opacity).
3.  **Shadows:** Shadows are highly diffused and soft, using a slight Forest Green (#2D6A4F) tint at very low opacity (5-8%) instead of pure black to maintain a natural, organic feel.
4.  **Patterns:** Use a low-opacity (3%) mandala pattern on the background layer to create a subtle sense of depth behind surface cards.

## Shapes
The shape language is soft and organic, avoiding sharp corners to maintain a "calm and trustworthy" persona. 

- **Cards & Containers:** Use a consistent 1rem (16px) radius to feel substantial yet friendly.
- **Interactive Elements:** Buttons, chips, and tags utilize a **full-pill** radius to emphasize the "Modern Science/Tech" aspect and provide a clear tactile affordance.

## Components
- **Buttons:** Primary buttons are pill-shaped, using the Forest Green background with White text. Secondary buttons use a Turmeric Gold border and text for high-end visibility.
- **Input Fields:** Minimalist with a soft bottom-border or a very light Forest Green outline. Focus states should transition the border to Turmeric Gold.
- **Cards:** White surfaces with a subtle noise/grain texture. Use the 1rem radius and ambient green-tinted shadows.
- **Chips & Tags:** Small, pill-shaped elements with a light tint of the primary color (10% opacity Forest Green) and Deep Forest text for categorization.
- **Progress Indicators:** Use the Turmeric Gold to represent "Enlightenment" or "Completion" in wellness journeys.
- **Dividers:** Use very thin (1px) lines in a faded Forest Green or the mandala pattern motifs to separate sections without breaking the flow.