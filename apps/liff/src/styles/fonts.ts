// Self-hosted fonts (Plan 01 §4.4). Never <link> fonts.googleapis.com.
// The `-variable` packages ship one file per axis, not per subset: `wght.css` carries
// every subset behind `unicode-range`, so a browser downloads only the Thai and Latin
// ranges a page actually uses.
import '@fontsource-variable/noto-sans-thai/wght.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/noto-sans/latin-700.css';
