export type ScaleMode = 'both' | 'width' | 'height' | 'none';

export interface FitToScreenOptions {
  elementWidth: number; // sprite or container width
  elementHeight: number; // sprite or container height

  screenWidth: number; // device screen width
  screenHeight: number; // device screen height

  originalScale?: number;

  maxRatioWidth?: number; // f.ex:  0.9
  maxRatioHeight?: number; // f.ex: 0.3

  mode?: ScaleMode; // 'both' | 'width' | 'height' | 'none'
  allowUpscale?: boolean; // if possible make element bigger than original size (>1)
}

export const fitToScreen = ({
  elementWidth,
  elementHeight,
  screenWidth,
  screenHeight,
  maxRatioWidth = 1,
  maxRatioHeight = 1,
  originalScale = 1,
  mode = 'both',
  allowUpscale = false
}: FitToScreenOptions): number => {
  if (mode === 'none') return originalScale || 1;

  const maxW = screenWidth * maxRatioWidth;
  const maxH = screenHeight * maxRatioHeight;

  let scale = 1;

  switch (mode) {
    case 'width':
      scale = maxW / elementWidth;
      break;

    case 'height':
      scale = maxH / elementHeight;
      break;

    case 'both':
      scale = Math.min(maxW / elementWidth, maxH / elementHeight);
      break;
  }

  if (!allowUpscale) {
    scale = Math.min(scale, 1);
  }

  return scale;
};
