// tailwind.config.js — Winner Court design system, booking-demo cut.
// Derived from the 38 byte-identical generated configs (ds.md §1.1), plus the two
// tokens the product cannot function without, plus explicit aliases for the v4-only
// class names the mockups ship, so the port renders what the screenshots show.
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  // darkMode intentionally omitted. 38 files declared darkMode:'class' and authored
  // ZERO dark: variants. Dead config — do not resurrect until dark is designed (D55).
  theme: {
    extend: {
      colors: {
        /* ---- PRIMARY / NAVY ---- */
        primary: '#07182e',                 // headings, primary CTA fill (near-black)
        'on-primary': '#ffffff',
        'primary-container': '#1d2d44',     // THE brand navy: hero cards, selected slots
        'on-primary-container': '#8595b0',
        'primary-fixed': '#d5e3ff',
        'primary-fixed-dim': '#b7c7e5',
        'on-primary-fixed': '#0b1c32',
        'on-primary-fixed-variant': '#384760',

        /* ---- SECONDARY / HONEY-OAT ---- */
        secondary: '#835418',               // peak prices, accent icons (reads dark brown)
        'on-secondary': '#ffffff',
        'secondary-container': '#fdbd77',   // the visible "honey": peak pills, hold banner
        'on-secondary-container': '#784a0d',
        'secondary-fixed': '#ffdcbb',
        'secondary-fixed-dim': '#faba75',
        'on-secondary-fixed': '#2b1700',
        'on-secondary-fixed-variant': '#673d00',

        /* ---- TERTIARY / DEEP OLIVE ----
           WARNING: `tertiary` is near-BLACK (#131a00). Never use it as a success fill.
           That is why "ชำระแล้ว" badges render black in the mockups. Use `success`. */
        tertiary: '#131a00',
        'on-tertiary': '#ffffff',
        'tertiary-container': '#263003',
        'on-tertiary-container': '#8c9960', // 3.07:1 on white — ≥18px ONLY
        'tertiary-fixed': '#dbe9a9',        // availability chips
        'tertiary-fixed-dim': '#bfcd8f',
        'on-tertiary-fixed': '#171e00',
        'on-tertiary-fixed-variant': '#404b1b',

        /* ---- SUCCESS (NEW) ----
           Formalises #606C38: 153 raw occurrences across 26 files, no token.
           Does all "available / confirmed / paid / open" work. 5.68:1 on white. */
        success: '#606c38',
        'on-success': '#ffffff',
        'success-container': '#dbe9a9',
        'on-success-container': '#2f3a12',

        /* ---- ERROR ---- */
        error: '#ba1a1a',
        'on-error': '#ffffff',
        'error-container': '#ffdad6',
        'on-error-container': '#93000a',

        /* ---- SURFACES ---- */
        surface: '#fbf9f5',
        background: '#fbf9f5',
        'surface-dim': '#dbdad6',
        'surface-container-lowest': '#ffffff',
        'surface-container-low': '#f5f3ef',
        'surface-container': '#efeeea',
        'surface-container-high': '#eae8e4',
        'surface-container-highest': '#e4e2de',
        'surface-variant': '#e4e2de',
        'on-surface': '#1b1c1a',
        'on-surface-variant': '#44474d',
        outline: '#75777e',                 // 4.47:1 — borders / ≥18px text only
        'outline-variant': '#c5c6cd',
        'inverse-surface': '#30312e',
        'inverse-on-surface': '#f2f0ed',

        /* ---- LINE BRAND (NEW) — 36 raw occurrences across 21 files.
           CORRECTION 1 vs ds.md: white on #06C755 is 2.26:1 and FAILS AA.
           Button hard-codes text-primary-container on bg-line (7.89:1).
           `line-a11y` exists only for cases that must keep white text. */
        line: { DEFAULT: '#06c755', hover: '#05b34c', a11y: '#04803a' },
      },

      /* ---- RADII ---- the shipped compressed scale (D54).
         NOTE rounded-lg is 8px here, NOT the 16px DESIGN.md prose claims.
         2xl/3xl left at Tailwind defaults, as shipped. */
      borderRadius: {
        DEFAULT: '0.25rem', // 4px
        lg: '0.5rem',       // 8px — slot chips, icon tiles, inner blocks
        xl: '0.75rem',      // 12px — CARDS, CTAs, inputs (the workhorse)
        full: '9999px',
      },

      spacing: {
        'space-2xs': '0.25rem', 'space-xs': '0.5rem', 'space-sm': '0.75rem',
        'space-md': '1rem',     'space-lg': '1.5rem', 'space-xl': '2rem',
        'space-2xl': '3rem',    'space-3xl': '4rem',
        'gutter-mobile': '1rem',
        // CORRECTION 2: `margin-mobile` deliberately dropped. It was 1rem, identical
        // to gutter-mobile, and the two were used interchangeably in ~50 places.
        // One name. If you see px-margin-mobile in ported markup, change it.
      },

      /* ---- TYPOGRAPHY ---- house convention: family and size are SEPARATE scales
         sharing a key, so every element carries both:
             class="font-headline-sm text-headline-sm"
         Noto Sans Thai is chained into EVERY stack — 15 files omitted it entirely. */
      fontFamily: {
        'display-lg':  ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-lg': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-md': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'headline-sm': ['Noto Sans', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-lg':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-md':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'body-sm':     ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-lg':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-md':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        'label-sm':    ['Inter Variable', 'Noto Sans Thai Variable', 'sans-serif'],
        sans:          ['Noto Sans Thai Variable', 'Noto Sans', 'sans-serif'],
      },
      // NEW-7 Thai line-height floor: every size <= 16px has line-height >= 1.5, because
      // Thai stacks vowels + tone marks above the x-height and descends below it.
      fontSize: {
        'display-lg':        ['40px', { lineHeight: '48px', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg-mobile': ['32px', { lineHeight: '40px', letterSpacing: '-0.01em', fontWeight: '700' }],
        'headline-lg':       ['28px', { lineHeight: '36px', letterSpacing: '-0.01em', fontWeight: '600' }],
        'headline-md':       ['22px', { lineHeight: '28px', fontWeight: '600' }],
        'headline-sm':       ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'body-lg':           ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md':           ['14px', { lineHeight: '22px', fontWeight: '400' }],
        'body-sm':           ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'label-lg':          ['14px', { lineHeight: '22px', letterSpacing: '0.01em', fontWeight: '600' }],
        'label-md':          ['12px', { lineHeight: '18px', letterSpacing: '0.02em', fontWeight: '600' }],
        'label-sm':          ['11px', { lineHeight: '17px', letterSpacing: '0.03em', fontWeight: '500' }],
      },

      /* ---- ELEVATION ---- DESIGN.md's three specified levels appear ZERO times in
         code. These are what the product actually ships, plus (CORRECTION 3) explicit
         aliases for the v4-only names so ported markup matches the screenshots. */
      boxShadow: {
        'xs':  '0 1px 2px rgba(29,45,68,0.06)',            // v4 name → 56 silent no-ops
        '2xs': '0 1px 1px rgba(29,45,68,0.04)',            // v4 name → 8 silent no-ops
        'app-header': '0 1px 8px rgba(0,0,0,0.04)',        // 28 uses — de-facto token
        'app-nav':    '0 -2px 12px rgba(29,45,68,0.06)',   // 25 uses — de-facto token
        'card':        '0 2px 12px rgba(29,45,68,0.04)',
        'card-raised': '0 4px 20px -4px rgba(29,45,68,0.07)',
        'sheet':       '0 12px 36px rgba(29,45,68,0.18)',
        'sticky-bar':  '0 -4px 20px rgba(29,45,68,0.08)',
      },
      backdropBlur: { xs: '2px' },   // v4 name → 5 silent no-ops

      // CORRECTION 4: scale-98 is used 4× and is not on Tailwind's scale.
      // Add it rather than lose the press feedback.
      scale: { '98': '.98' },

      minHeight: { touch: '48px' },
      minWidth:  { touch: '44px' },
      maxWidth:  { liff: '430px' },  // clamp the column; most mockups forgot this
      height:    { 'app-bar': '4rem', 'app-nav': '4rem' },
      zIndex:    { header: '50', nav: '50', drawer: '40', 'grid-head': '20' },
    },
  },

  plugins: [
    function ({ addUtilities, addComponents, theme }) {
      addUtilities({
        // Applied in 6 files, DEFINED IN 1. Worked only by accident, via a global
        // ::-webkit-scrollbar rule. Define it properly.
        '.no-scrollbar': {
          'scrollbar-width': 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        },
        '.pt-safe': { paddingTop: 'env(safe-area-inset-top, 0px)' },
        '.pb-safe': { paddingBottom: 'env(safe-area-inset-bottom, 0px)' },
        // Several mockup sticky bars sit at bare `bottom-16` over an h-16 nav with no
        // pb-safe, and collide on notched devices. Always use this instead.
        '.bottom-nav-safe': { bottom: 'calc(4rem + env(safe-area-inset-bottom, 0px))' },

        /* ---- SLOT PATTERNS — settles D53 ----
           CORRECTION 5 vs ds.md: `_1` renders booked=RED / maintenance=grey and `2.`
           renders exactly the inverse. Canon: BOOKED = neutral grey + 45° hatch (a
           normal, expected, non-alarming state); MAINTENANCE = error-container + dot
           grid (an exception the venue must fix). ds.md's draft had maintenance grey.
           The PATTERN, not the colour, carries the meaning — this is the non-colour-only
           encoding the design system advertises and production dropped. */
        '.pattern-booked': {
          backgroundColor: theme('colors.surface-container-high'),
          backgroundImage:
            'repeating-linear-gradient(45deg,#d6d3cd 0,#d6d3cd 1.5px,transparent 1.5px,transparent 7px)',
        },
        '.pattern-maintenance': {
          backgroundColor: theme('colors.error-container'),
          backgroundImage: 'radial-gradient(rgba(147,0,10,.32) 1.2px, transparent 1.2px)',
          backgroundSize: '7px 7px',
        },
        // The legend swatches must show the same encoding at 16px.
        '.swatch-booked': {
          backgroundColor: theme('colors.surface-container-high'),
          backgroundImage:
            'repeating-linear-gradient(45deg,#c9c5bd 0,#c9c5bd 1.5px,transparent 1.5px,transparent 5px)',
        },
        '.swatch-maintenance': {
          backgroundColor: theme('colors.error-container'),
          backgroundImage: 'radial-gradient(rgba(147,0,10,.4) 1px, transparent 1px)',
          backgroundSize: '5px 5px',
        },
      });

      addComponents({
        // DESIGN.md: "Focus ring: 2px Honey Oat with 2px offset."
        // Implemented in 0 of 48 files. The global default lives in index.css;
        // this class is the opt-in for elements needing a different offset.
        '.focus-ring': {
          '&:focus-visible': {
            outline: `2px solid ${theme('colors.secondary-container')}`,
            outlineOffset: '2px',
          },
        },
      });
    },
  ],
};
