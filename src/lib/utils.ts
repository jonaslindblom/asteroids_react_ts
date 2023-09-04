import { Size } from "src/lib/types";

export const registerListener = (
  eventName: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (ev: any) => void
) => {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};

export function getRandomStartingPoint(size: Size, aradius: number) {
  const canvasWidth = size.width;
  const canvasHeight = size.height;

  const side = Math.floor(Math.random() * 4);

  let startX, startY, direction;

  if (side === 0) {
    // Top side
    startX = Math.floor(Math.random() * canvasWidth);
    startY = 0;
    direction = 180 * Math.random();
  } else if (side === 1) {
    // Right side
    startX = canvasWidth;
    startY = Math.floor(Math.random() * canvasHeight);
    direction = 90 + 180 * Math.random();
  } else if (side === 2) {
    // Bottom side
    startX = Math.floor(Math.random() * canvasWidth);
    startY = canvasHeight;
    direction = 180 + 180 * Math.random();
  } else {
    // Left side
    startX = 0;
    startY = Math.floor(Math.random() * canvasHeight);
    direction = -90 + 180 * Math.random();
  }

  return {
    x: startX - aradius,
    y: startY - aradius,
    direction,
  };
}

// Theoretically, can get > 100% if the hitting newly split asteroid
// (... shooting two with one shot)
export function hitPercentage(hits: number, fired: number) {
  return hits > 0 ? Math.min(Math.round((hits / fired) * 100), 100) : 0;
}
