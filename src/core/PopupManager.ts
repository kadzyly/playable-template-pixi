export interface IPopup {
  show(): Promise<void> | void;
  hide(): Promise<void> | void;
  resize?(width: number, height: number): void;
  destroy?(): void;
}

export class PopupManager {
  private static instance: PopupManager;
  private currentPopup: IPopup | null = null;
  private width = 0;
  private height = 0;

  private constructor() {}

  public static getInstance(): PopupManager {
    if (!PopupManager.instance) {
      PopupManager.instance = new PopupManager();
    }
    return PopupManager.instance;
  }

  resize(width: number, height: number) {
    this.width = width;
    this.height = height;

    const popup = this.currentPopup as any;
    popup?.resize?.(width, height);
  }

  async show(popup: IPopup): Promise<void> {
    if (this.currentPopup) {
      await this.hideCurrent();
    }

    this.currentPopup = popup;
    popup.resize?.(this.width, this.height);
    await popup.show();
  }

  async hideCurrent(): Promise<void> {
    if (!this.currentPopup) return;

    await this.currentPopup.hide();
    this.currentPopup = null;
  }

  isPopupOpened(): boolean {
    return this.currentPopup !== null;
  }
}
