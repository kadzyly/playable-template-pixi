import { sound, Sound } from '@pixi/sound';

export class SoundManager {
  private static _bgMusic?: Sound;
  private static _enabled = true;

  static get enabled(): boolean {
    return this._enabled;
  }

  static init(): void {
    this._bgMusic = sound.find('bg');

    if (!this._bgMusic) {
      console.warn('SoundManager bgMusic not found');
    }
  }

  static playBgMusic(): void {
    if (!this._enabled || !this._bgMusic) return;

    if (!this._bgMusic.isPlaying) {
      this._bgMusic.play({
        loop: true,
        volume: 0.3
      });
    }
  }

  static stopBgMusic(): void {
    this._bgMusic?.stop();
  }

  static playClickButton(): void {
    if (!this._enabled) return;

    sound.play('buttonClick', {
      volume: 0.8
    });
  }

  static playWinMusic(): void {
    if (!this._enabled) return;

    sound.play('win', {
      volume: 0.8
    });
  }

  static mute(): void {
    this._enabled = false;
    sound.volumeAll = 0;
  }

  static unmute(): void {
    this._enabled = true;
    sound.volumeAll = 1;
  }

  static toggle(): void {
    this._enabled ? this.mute() : this.unmute();
  }
}
