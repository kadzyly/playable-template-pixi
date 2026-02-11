declare const LANGUAGE: string;

type TLang = {
  go: string;
  play: string;
};

type TLangName = 'en' | 'de';

export const LOCALIZATION: Record<TLangName, TLang> = {
  en: {
    go: 'Go',
    play: 'Play'
  },
  de: {
    go: 'Los',
    play: 'Spielen'
  }
};

const currentLang = (typeof LANGUAGE !== 'undefined' ? LANGUAGE : 'en') as TLangName;

export const TEXT: TLang = LOCALIZATION[currentLang] || LOCALIZATION.en;
