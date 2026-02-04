import * as PIXI from 'pixi.js';
import { createApp } from './core/App';
import { loadAllAssets } from './core/AssetLoader';
import { SoundManager } from './core/SoundManager';
import { SceneManager, SceneType } from './core/SceneManager';
import { loadFonts } from './core/Fonts';
import { ScreenAdapter } from './core/ScreenAdapter';

export class Game {
  private app!: PIXI.Application;
  private sceneManager!: SceneManager;

  constructor(width: number, height: number) {
    void this.init(width, height);
  }

  public resize(width: number, height: number): void {
    if (!this.app || !this.sceneManager) return;

    const screenAdapter = ScreenAdapter.getInstance();
    screenAdapter.updateDimensions(width, height);

    this.app.renderer.resize(width, height);
    this.sceneManager.resize(width, height);
  }

  public async switchScene(sceneType: SceneType): Promise<void> {
    if (!this.sceneManager) return;
    await this.sceneManager.switchScene(sceneType);
  }

  public getCurrentSceneType(): SceneType | null {
    if (!this.sceneManager) return null;
    return this.sceneManager.getCurrentSceneType();
  }

  private async init(width: number, height: number): Promise<void> {
    this.app = await createApp(width, height);

    const screenAdapter = ScreenAdapter.getInstance();
    screenAdapter.updateDimensions(width, height);

    await loadAllAssets();
    await loadFonts();

    SoundManager.init();

    this.sceneManager = new SceneManager();
    this.app.stage.addChild(this.sceneManager);

    // Start with main scene
    await this.sceneManager.switchScene(SceneType.MAIN);
    this.resize(width, height);
  }
}
