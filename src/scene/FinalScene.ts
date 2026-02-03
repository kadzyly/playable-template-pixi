import * as PIXI from 'pixi.js';
import { Text, TextStyle } from 'pixi.js';
import { DEFAULT_FONT_STACK } from '../core/Fonts';

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

    this.text.anchor.set(0.5);
    this.text.position.set(width / 2, height / 2);
    this.addChild(this.text);
  }

  public resize(width: number, height: number): void {
    this.text.position.set(width / 2, height / 2);
  }
}
