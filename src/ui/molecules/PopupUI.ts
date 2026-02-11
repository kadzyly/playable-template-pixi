import { Container, Graphics } from 'pixi.js';
import { gsap } from 'gsap';
import { ScreenAdapter } from '../../core/ScreenAdapter';

export abstract class PopupUI extends Container {
  protected panel: Container;
  private background: Container;

  private baseScale = 1;
  screenAdapter: ScreenAdapter;

  constructor() {
    super();

    this.screenAdapter = ScreenAdapter.getInstance();

    this.background = new Container();
    this.background.alpha = 0;

    const bgGraphics = new Graphics();
    bgGraphics.beginFill(0x000000);
    bgGraphics.drawRect(0, 0, 1, 1);
    bgGraphics.endFill();
    this.background.addChild(bgGraphics);

    this.panel = new Container();
    this.panel.alpha = 0;

    this.addChild(this.background, this.panel);
  }

  public resize(width: number, height: number) {
    this.position.set(width * 0.5, height * 0.5);

    const bgGraphics = this.background.children[0] as Graphics;
    bgGraphics.clear();
    bgGraphics.beginFill(0x000000);
    bgGraphics.drawRect(-width * 0.5, -height * 0.5, width, height);
    bgGraphics.endFill();

    this.panel.x = 0;
    this.panel.y = 0;

    const contentWidth = 300;
    const contentHeight = 300;

    if (this.screenAdapter.isLandscape()) {
      const maxH = height * 0.9;
      this.baseScale = contentHeight > maxH ? maxH / contentHeight : 1;
    } else {
      const maxW = width * 0.9;
      this.baseScale = contentWidth > maxW ? maxW / contentWidth : 1;
    }

    if (this.panel.alpha > 0) {
      this.panel.scale.set(this.baseScale);
    }
  }

  show() {
    gsap.killTweensOf(this.panel.scale);
    gsap.killTweensOf(this.panel);
    gsap.killTweensOf(this.background);

    this.panel.alpha = 0;
    this.panel.scale.set(0);
    this.background.alpha = 0;

    const tl = gsap.timeline();

    // background: opacity 0 -> 1
    tl.to(this.background, {
      alpha: 0.7,
      duration: 0.3,
      ease: 'power1.out'
    });

    tl.to(
      this.panel,
      {
        alpha: 1,
        duration: 0.3,
        ease: 'power1.out'
      },
      0
    );

    tl.to(
      this.panel.scale,
      {
        x: this.baseScale * 1.2,
        y: this.baseScale * 1.2,
        duration: 0.35,
        ease: 'back.out(1.7)'
      },
      0
    );

    tl.to(
      this.panel.scale,
      {
        x: this.baseScale,
        y: this.baseScale,
        duration: 0.15,
        ease: 'power2.out'
      },
      '-=0.1'
    );
  }

  hide(onHidden?: () => void) {
    gsap.killTweensOf(this.panel.scale);
    gsap.killTweensOf(this.panel);
    gsap.killTweensOf(this.background);

    const tl = gsap.timeline();

    // background: opacity 0.7 -> 0
    tl.to(this.background, {
      alpha: 0,
      duration: 0.2,
      ease: 'power1.in'
    });

    tl.to(
      this.panel,
      {
        alpha: 0,
        duration: 0.2,
        ease: 'power1.in'
      },
      0
    );

    tl.to(
      this.panel.scale,
      {
        x: 0,
        y: 0,
        duration: 0.2,
        ease: 'back.in(1.7)',
        onComplete: onHidden
      },
      0
    );
  }
}
