export class ScreenAdapter {
  private static instance: ScreenAdapter;

  private constructor() {}

  private _width: number = 0;

  public get width(): number {
    return this._width;
  }

  private _height: number = 0;

  public get height(): number {
    return this._height;
  }

  public static getInstance(): ScreenAdapter {
    if (!ScreenAdapter.instance) {
      ScreenAdapter.instance = new ScreenAdapter();
    }
    return ScreenAdapter.instance;
  }

  public updateDimensions(width: number, height: number): void {
    this._width = width;
    this._height = height;
  }

  public isLandscape(): boolean {
    return this._width > this._height;
  }

  public isPortrait(): boolean {
    return this._height > this._width;
  }

  public isMobile(): boolean {
    return this._width < 768;
  }

  public isMobileXs(): boolean {
    return this._width <= 360;
  }

  public isTablet(): boolean {
    return this._width >= 768 && this._width < 1024;
  }

  public isDesktop(): boolean {
    return this._width >= 1024;
  }

  public getAspectRatio(): number {
    return this._width / this._height;
  }

  public getScreenType(): 'mobile' | 'tablet' | 'desktop' {
    if (this.isMobile()) return 'mobile';
    if (this.isTablet()) return 'tablet';
    return 'desktop';
  }

  public getOrientation(): 'landscape' | 'portrait' {
    return this.isLandscape() ? 'landscape' : 'portrait';
  }
}
