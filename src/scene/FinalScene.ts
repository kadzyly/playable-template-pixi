import * as PIXI from 'pixi.js';
import { Text, TextStyle } from 'pixi.js';
import { DEFAULT_FONT_STACK } from '../core/Fonts';
import { ButtonUI } from '../ui/atoms/ButtonUI';
import { SceneType } from '../core/SceneManager';

export class FinalScene extends PIXI.Container {
  private text: PIXI.Text;

  constructor(width: number, height: number) {
    super();

    this.text = new Text({
      text: 'Final scene',
      style: new TextStyle({
        fontFamily: DEFAULT_FONT_STACK,
        fontSize: 40,
        align: 'center'
      })
    });

    this.addChild(this.text);
  }

  public resize(width: number, height: number): void {
    this.text.x = width / 2;
    this.text.y = height / 2;
  }
}
