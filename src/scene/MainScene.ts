import * as PIXI from 'pixi.js';
import { ButtonUI } from '../ui/atoms/ButtonUI';
import { sdk } from '@smoud/playable-sdk';
import { ScreenAdapter } from '../core/ScreenAdapter';
import { SceneManager, SceneType } from '../core/SceneManager';

export class MainScene extends PIXI.Container {
  private installButton: ButtonUI;
  private finalSceneButton: ButtonUI;
  private screenAdapter: ScreenAdapter;

  constructor() {
    super();

    this.screenAdapter = ScreenAdapter.getInstance();

    this.installButton = new ButtonUI({
      text: 'Install',
      width: 300,
      height: 80,
      backgroundColor: 0x025537,
      textColor: 0xfaed6d,
      fontSize: 56
    });

    this.installButton.on('click', () => sdk.install());

    this.finalSceneButton = new ButtonUI({
      text: 'Go to Final',
      width: 300,
      height: 80,
      backgroundColor: 0x4a5568,
      textColor: 0xffffff,
      fontSize: 40
    });

    this.finalSceneButton.on('click', () => {
      // Emit event to parent to switch scene
      this.emit('switchScene', SceneType.FINAL);
    });

    this.addChild(this.installButton);
    this.addChild(this.finalSceneButton);

    this.resize(this.screenAdapter.width, this.screenAdapter.height);
  }

  public resize(width: number, height: number): void {
    this.installButton.x = width / 2;
    this.installButton.y = height / 2 - 60;
    
    this.finalSceneButton.x = width / 2;
    this.finalSceneButton.y = height / 2 + 60;
  }
}
