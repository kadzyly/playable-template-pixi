import * as PIXI from 'pixi.js';
import { ASSETS } from './config';
// import {
//   PLAYER_IDLE_FRAMES as PIXI.SpritesheetData,
// } from './frames-data';

const SPRITESHEET_CONFIG = {
  // playerIdle: PLAYER_IDLE_FRAMES,
} as const;

export async function loadAllAssets(onProgress?: (progress: number) => void): Promise<void> {
  const allAssets = [
    ...Object.entries(ASSETS.images).map(([alias, src]) => ({ alias, src })),
    ...Object.entries(ASSETS.audio).map(([alias, src]) => ({ alias, src })),
    ...Object.entries(ASSETS.spritesheets).map(([alias, src]) => ({ alias: `${alias}Texture`, src }))
  ];

  // 1. Load all
  await PIXI.Assets.load(allAssets, (progress) => {
    onProgress?.(progress);
  });

  // 2. Parse all spritesheets
  for (const [key, frames] of Object.entries(SPRITESHEET_CONFIG)) {
    const texture = PIXI.Assets.get(`${key}Texture`);
    if (!texture) {
      console.warn(`Texture not found for spritesheet: ${key}`);
      continue;
    }

    const sheet = new PIXI.Spritesheet(texture, frames as PIXI.SpritesheetData);
    sheet.parse().then(() => {
      PIXI.Cache.set(`${key}Sheet`, sheet);
    });
  }
}
