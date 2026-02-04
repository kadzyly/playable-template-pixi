import * as PIXI from 'pixi.js';
import {
  Container,
  FederatedPointerEvent,
  Graphics,
  Sprite,
  Text,
  TextStyle,
  Texture,
  Ticker
} from 'pixi.js';
import { SoundManager } from '../../core/SoundManager';
import { FontFamily, DEFAULT_FONT_STACK } from '../../core/Fonts';

type ButtonOptions = {
  text?: string;
  width?: number;
  height?: number;
  radius?: number;
  fontSize?: number;
  textColor?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  backgroundTexture?: Texture | null;
  pressedScale?: number;
  isDisabled?: boolean;

  borderColor?: number;
  borderWidth?: number;

  glowColor?: number;
  glowAlpha?: number;
  glowSize?: number;
};

const DEFAULTS: Required<Omit<ButtonOptions, 'backgroundTexture'>> = {
  text: '',
  width: 160,
  height: 52,
  radius: 10,
  fontSize: 24,
  textColor: 0xffffff,
  backgroundColor: 0x000000,
  backgroundAlpha: 1,
  pressedScale: 0.9,
  isDisabled: false,
  borderColor: 0x000000,
  borderWidth: 0,
  glowColor: 0x000000,
  glowAlpha: 0,
  glowSize: 0
};

export class ButtonUI extends Container {
  private bg!: Sprite | Graphics;
  private glow!: Graphics;
  private textField: Text;
  private opts: Required<Omit<ButtonOptions, 'backgroundTexture'>> & {
    backgroundTexture: Texture | null;
  };
  private targetScale = 1;
  private currentScale = 1;
  private animationSpeed = 0.15;
  private disabledBackgroundColor!: number;
  private disabledTextColor!: number;
  private handSprite: Sprite;
  private handAnimationTicker: ((ticker: Ticker) => void) | null = null;
  private animationTicker: (() => void) | null = null;

  constructor(options: ButtonOptions = {}) {
    super();

    this.opts = {
      ...DEFAULTS,
      backgroundTexture: null,
      ...options
    };

    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.pivot.set(this.opts.width / 2, this.opts.height / 2);

    // calculate disabled colors
    this.disabledBackgroundColor = this.darkenColor(this.opts.backgroundColor, 0.6);
    this.disabledTextColor = this.darkenColor(this.opts.textColor, 0.7);

    this.createBackground();
    this.createGlow();
    this.textField = this.createLabel();
    const handAsset = PIXI.Assets.get('hand') || PIXI.Texture.EMPTY;
    this.handSprite = new Sprite(handAsset);
    this.handSprite.visible = false;

    this.addChild(this.glow, this.bg, this.textField, this.handSprite);
    this.setupEvents();
    this.setupAnimation();

    // Apply initial disabled state
    if (this.opts.isDisabled) {
      this.disable();
    }
  }

  public setText(text: string) {
    this.textField.text = text;
  }

  public disable() {
    this.opts.isDisabled = true;
    this.eventMode = 'none';
    this.cursor = 'default';
    this.updateDisabledStyle();
  }

  public enable() {
    this.opts.isDisabled = false;
    this.eventMode = 'static';
    this.cursor = 'pointer';
    this.updateNormalStyle();
  }

  public isDisabled() {
    return this.opts.isDisabled;
  }

  public showHand() {
    this.handSprite.anchor.set(1, 0);
    // position: bottom right
    this.handSprite.position.set(this.opts.width, this.opts.height * 0.6);
    this.handSprite.visible = true;

    let time = 0;
    this.handAnimationTicker = (ticker: Ticker) => {
      time += ticker.deltaTime * 0.05;
      // from 0.65 to 0.70
      const scale = 0.65 + Math.sin(time) * 0.05;
      if (this.handSprite) {
        this.handSprite.scale.set(scale);
      }
    };
    Ticker.shared.add(this.handAnimationTicker);
  }

  public hideHand() {
    if (this.handSprite) {
      if (this.handAnimationTicker) {
        Ticker.shared.remove(this.handAnimationTicker);
        this.handAnimationTicker = null;
      }
      this.handSprite.visible = false;
    }
  }

  private createBackground() {
    const { width, height, radius, backgroundTexture, borderColor, borderWidth } = this.opts;

    if (backgroundTexture) {
      const sprite = new Sprite(backgroundTexture);
      sprite.width = width;
      sprite.height = height;
      this.bg = sprite;
    } else {
      const g = new Graphics();
      g.roundRect(0, 0, width, height, radius);
      g.fill({
        color: this.opts.backgroundColor,
        alpha: this.opts.backgroundAlpha
      });

      if (borderWidth > 0) {
        g.stroke({ color: borderColor, width: borderWidth });
      }

      this.bg = g;
    }
  }

  private createGlow() {
    const { width, height, radius, glowColor, glowAlpha, glowSize } = this.opts;

    const g = new Graphics();

    if (glowSize > 0 && glowAlpha > 0) {
      const glowPadding = glowSize;
      g.roundRect(
        -glowPadding,
        -glowPadding,
        width + glowPadding * 2,
        height + glowPadding * 2,
        radius + glowPadding
      );
      g.fill({
        color: glowColor,
        alpha: glowAlpha
      });

      // blur filter for glow effect
      g.filters = [new PIXI.BlurFilter(glowSize)];
    }

    this.glow = g;
  }

  private createLabel() {
    const style = new TextStyle({
      fontFamily: DEFAULT_FONT_STACK,
      fill: this.opts.textColor,
      fontSize: this.opts.fontSize,
      fontWeight: '400',
      align: 'center',

      dropShadow: {
        alpha: 0.5,
        angle: Math.PI / 4,
        blur: 0,
        color: 0x4a4a4a,
        distance: 3
      }
    });

    const text = new Text({
      text: this.opts.text,
      style
    });

    text.anchor.set(0.5);
    text.position.set(this.opts.width / 2, this.opts.height / 2 - 3);

    return text;
  }

  private setupEvents() {
    this.on('pointerover', this.onHover, this);
    this.on('pointerout', this.onOut, this);
    this.on('pointerdown', this.onDown, this);
    this.on('pointerup', this.onUp, this);
    this.on('pointerupoutside', this.onUp, this);
  }

  private onHover(_: FederatedPointerEvent) {
    if (this.opts.isDisabled) return;
    //
  }

  private onOut(_: FederatedPointerEvent) {
    if (this.opts.isDisabled) return;
    //
  }

  private onDown(_: FederatedPointerEvent) {
    if (this.opts.isDisabled) return;
    this.targetScale = this.opts.pressedScale;
    SoundManager.playClickButton();
  }

  private onUp(event: FederatedPointerEvent) {
    if (this.opts.isDisabled) return;
    this.targetScale = 1;
    this.emit('click', event);
  }

  private updateDisabledStyle() {
    // Update background color
    if (this.bg instanceof Graphics) {
      this.bg.clear();
      this.bg.roundRect(0, 0, this.opts.width, this.opts.height, this.opts.radius);
      this.bg.fill({
        color: this.disabledBackgroundColor,
        alpha: this.opts.backgroundAlpha
      });

      if (this.opts.borderWidth > 0) {
        this.bg.stroke({ color: this.opts.borderColor, width: this.opts.borderWidth });
      }
    }

    // update text color
    this.textField.style.fill = this.disabledTextColor;
  }

  private updateNormalStyle() {
    // update background color
    if (this.bg instanceof Graphics) {
      this.bg.clear();
      this.bg.roundRect(0, 0, this.opts.width, this.opts.height, this.opts.radius);
      this.bg.fill({
        color: this.opts.backgroundColor,
        alpha: this.opts.backgroundAlpha
      });

      if (this.opts.borderWidth > 0) {
        this.bg.stroke({ color: this.opts.borderColor, width: this.opts.borderWidth });
      }
    }

    // update text color
    this.textField.style.fill = this.opts.textColor;
  }

  private darkenColor(color: number, factor: number): number {
    const r = (color >> 16) & 0xff;
    const g = (color >> 8) & 0xff;
    const b = color & 0xff;

    const darkerR = Math.floor(r * factor);
    const darkerG = Math.floor(g * factor);
    const darkerB = Math.floor(b * factor);

    return (darkerR << 16) | (darkerG << 8) | darkerB;
  }

  private setupAnimation() {
    this.animationTicker = () => {
      const diff = this.targetScale - this.currentScale;
      this.currentScale += diff * this.animationSpeed;

      if (Math.abs(diff) < 0.001) {
        this.currentScale = this.targetScale;
      }

      this.scale.set(this.currentScale);
    };
    Ticker.shared.add(this.animationTicker);
  }

  public destroy() {
    // clean up animation ticker
    if (this.animationTicker) {
      Ticker.shared.remove(this.animationTicker);
      this.animationTicker = null;
    }

    // clean up hand animation ticker
    this.hideHand();

    super.destroy();
  }
}
