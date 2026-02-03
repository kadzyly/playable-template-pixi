import { Text, TextStyle } from 'pixi.js';
import { PopupUI } from '../molecules/PopupUI';
import { DEFAULT_FONT_STACK } from '../../core/Fonts';

export class FinalResultPopup extends PopupUI {
  constructor() {
    super();

    const style = new TextStyle({
      fontFamily: DEFAULT_FONT_STACK,
      fontSize: 70,
      fill: 0xffffff,
      align: 'center'
    });

    const line2 = new Text({ text: `Win`, style });

    line2.anchor.set(0.5);
    line2.y = 0;

    this.panel.addChild(line2);
  }
}
