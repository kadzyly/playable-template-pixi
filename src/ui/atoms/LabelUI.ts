import { Container, Text, TextStyle, Ticker } from 'pixi.js';
import { DEFAULT_FONT_STACK } from '../../core/Fonts';

type ButtonOptions = {
  text?: string;
  fontSize?: number;
  textColor?: number;
  pressedScale?: number;
};

const DEFAULTS: Required<ButtonOptions> = {
  text: '',
  fontSize: 24,
  textColor: 0xffffff,
  pressedScale: 0.9
};

export class LabelUI extends Container {
  private textField: Text;

  private opts: Required<ButtonOptions>;

  private targetScale = 1;
  private currentScale = 1;
  private animationSpeed = 0.15;

  constructor(options: ButtonOptions = {}) {
    super();

    this.opts = {
      ...DEFAULTS,
      ...options
    };

    this.eventMode = 'static';
    this.textField = this.createLabel();

    this.addChild(this.textField);
  }

  public setText(text: string) {
    this.textField.text = text;
  }

  public pulseScale(downScale: number = 0.95, durationMs: number = 100) {
    const originalScale = this.targetScale;

    this.targetScale = originalScale * downScale;

    setTimeout(() => {
      this.targetScale = originalScale;
    }, durationMs);
  }

  private setupAnimation() {
    Ticker.shared.add(() => {
      const diff = this.targetScale - this.currentScale;
      this.currentScale += diff * this.animationSpeed;

      if (Math.abs(diff) < 0.001) {
        this.currentScale = this.targetScale;
      }

      this.scale.set(this.currentScale);
    });
  }

  private createLabel() {
    const style = new TextStyle({
      fontFamily: DEFAULT_FONT_STACK,
      fill: this.opts.textColor,
      fontSize: this.opts.fontSize,
      fontWeight: '400',
      align: 'center'
    });

    const text = new Text({
      text: this.opts.text,
      style
    });

    text.anchor.set(0.5);

    return text;
  }
}
