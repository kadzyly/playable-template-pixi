import marvinFontUrl from 'assets/Marvin.ttf';

/**
 *  ────────────────────────────────────────────────
 *  How to use fonts in the project
 *  ────────────────────────────────────────────────
 *
 *  Option 1. Recommended default (most cases)
 *    fontFamily: DEFAULT_FONT_STACK
 *
 *  Option 2. Explicit primary font + automatic fallbacks
 *    fontFamily: getFontStack(FontFamily.MARVIN)
 *    fontFamily: getFontStack(FontFamily.ARIAL)
 *
 *  Option 3. Just the font name (no fallbacks — rarely recommended)
 *    fontFamily: FontFamily.MARVIN
 *
 */

export enum FontFamily {
  MARVIN = 'Marvin',
  ARIAL = 'Arial',
  SANS_SERIF = 'sans-serif'
}

export interface FontConfig {
  family: FontFamily;
  // path to the font file (empty for system/web-safe fonts)
  url: string;
  // '400', '500', '700', etc.
  weight: string;
  //  'normal' | 'italic', etc.
  style: string;
}

export const FONT_CONFIGS: Record<FontFamily, FontConfig> = {
  [FontFamily.MARVIN]: {
    family: FontFamily.MARVIN,
    url: marvinFontUrl,
    weight: '400',
    style: 'normal'
  },
  [FontFamily.ARIAL]: {
    family: FontFamily.ARIAL,
    url: '',
    weight: '400',
    style: 'normal'
  },
  [FontFamily.SANS_SERIF]: {
    family: FontFamily.SANS_SERIF,
    url: '',
    weight: '400',
    style: 'normal'
  }
};

export const DEFAULT_FONT_STACK = `${FontFamily.MARVIN}, ${FontFamily.ARIAL}, ${FontFamily.SANS_SERIF}`;

let loaded = false;

export async function loadFonts(): Promise<void> {
  if (loaded) return;

  const loadPromises: Promise<void>[] = [];

  // Load only custom fonts (web fonts)
  Object.values(FONT_CONFIGS).forEach((config) => {
    if (config.url) {
      const promise = loadFont(config);
      loadPromises.push(promise);
    }
  });

  try {
    await Promise.all(loadPromises);
    loaded = true;
    console.log('All fonts loaded successfully');
  } catch (err) {
    console.error('Failed to load fonts:', err);
  }
}

async function loadFont(config: FontConfig): Promise<void> {
  try {
    const fontFace = new FontFace(config.family, `url(${config.url})`, {
      style: config.style,
      weight: config.weight
    });

    const loadedFont = await fontFace.load();
    document.fonts.add(loadedFont);
    console.log(`Font ${config.family} loaded successfully`);
  } catch (err) {
    console.error(`Failed to load font ${config.family}:`, err);
    throw err;
  }
}

/**
 * @example
 * fontFamily: getFontStack() ->  "Marvin400, Arial, sans-serif"
 * fontFamily: getFontStack(FontFamily.ARIAL) -> "Arial, sans-serif"
 */
export function getFontStack(primaryFont: FontFamily = FontFamily.MARVIN): string {
  const fallbacks = [FontFamily.ARIAL, FontFamily.SANS_SERIF].filter((font) => font !== primaryFont);
  return `${primaryFont}, ${fallbacks.join(', ')}`;
}
