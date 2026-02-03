import handAsset from 'assets/hand.png';
import bgMusicAsset from 'assets/bg.mp3';
import buttonClickMusicAsset from 'assets/button_click.mp3';
import winMusicAsset from 'assets/win_audio.mp3';

export const ASSETS = {
  // SIMPLE IMAGES
  images: {
    hand: handAsset
  },

  // AUDIO
  audio: {
    bg: bgMusicAsset,
    buttonClick: buttonClickMusicAsset,
    win: winMusicAsset
  },

  // ANIMATION (Sprite sheets)
  spritesheets: {
    // playerIdle: 'assets/player_idle_texture.png'
  }
} as const;

// types
export type ImageKey = keyof typeof ASSETS.images;
export type AudioKey = keyof typeof ASSETS.audio;
export type SpritesheetKey = keyof typeof ASSETS.spritesheets;
