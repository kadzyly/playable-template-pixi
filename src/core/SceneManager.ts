import * as PIXI from 'pixi.js';
import { MainScene } from '../scene/MainScene';
import { FinalScene } from '../scene/FinalScene';

export enum SceneType {
  MAIN = 'main',
  FINAL = 'final'
}

export interface IScene extends PIXI.Container {
  resize(width: number, height: number): void;
}

export class SceneManager extends PIXI.Container {
  private currentScene: IScene | null = null;
  private scenes: Map<SceneType, IScene> = new Map();
  private currentSceneType: SceneType | null = null;

  constructor() {
    super();
    this.initializeScenes();
  }

  private initializeScenes(): void {
    this.scenes.set(SceneType.MAIN, new MainScene());
    this.scenes.set(SceneType.FINAL, new FinalScene(0, 0));
    
    // Listen to scene events
    const mainScene = this.scenes.get(SceneType.MAIN);
    if (mainScene) {
      mainScene.on('switchScene', this.handleSceneSwitchRequest.bind(this));
    }
  }

  private handleSceneSwitchRequest(sceneType: SceneType): void {
    void this.switchScene(sceneType);
  }

  public async switchScene(sceneType: SceneType): Promise<void> {
    if (this.currentSceneType === sceneType) {
      return;
    }

    const newScene = this.scenes.get(sceneType);
    if (!newScene) {
      throw new Error(`Scene ${sceneType} not found`);
    }

    // Hide current scene with fade out
    if (this.currentScene) {
      await this.fadeOutScene(this.currentScene);
      this.removeChild(this.currentScene);
    }

    // Add and show new scene with fade in
    this.addChild(newScene);
    await this.fadeInScene(newScene);

    this.currentScene = newScene;
    this.currentSceneType = sceneType;
  }

  public getCurrentScene(): IScene | null {
    return this.currentScene;
  }

  public getCurrentSceneType(): SceneType | null {
    return this.currentSceneType;
  }

  public resize(width: number, height: number): void {
    // Resize all scenes to keep them ready
    this.scenes.forEach(scene => {
      scene.resize(width, height);
    });
  }

  private async fadeOutScene(scene: IScene): Promise<void> {
    return new Promise((resolve) => {
      scene.alpha = 1;
      
      const fadeOut = () => {
        scene.alpha -= 0.05;
        
        if (scene.alpha <= 0) {
          scene.alpha = 0;
          resolve();
        } else {
          requestAnimationFrame(fadeOut);
        }
      };
      
      fadeOut();
    });
  }

  private async fadeInScene(scene: IScene): Promise<void> {
    return new Promise((resolve) => {
      scene.alpha = 0;
      
      const fadeIn = () => {
        scene.alpha += 0.05;
        
        if (scene.alpha >= 1) {
          scene.alpha = 1;
          resolve();
        } else {
          requestAnimationFrame(fadeIn);
        }
      };
      
      fadeIn();
    });
  }

  public destroy(): void {
    this.scenes.forEach(scene => {
      scene.destroy({ children: true });
    });
    this.scenes.clear();
    this.currentScene = null;
    this.currentSceneType = null;
    super.destroy({ children: true });
  }
}
