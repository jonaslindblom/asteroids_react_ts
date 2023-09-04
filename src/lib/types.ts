export interface Size {
  width: number;
  height: number;
}
export interface SpaceObject {
  id: string;
  x: number;
  y: number;
  r: number;
  direction: number;
  speed: number;
  rotation?: number;
  rotationDir?: number;
  isHit?: boolean;
}

export interface ScoreData {
  score: number;
  fired: number;
  hits: number;
  hitRate: number;
}
