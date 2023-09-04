import { ReactComponent as AsteroidSVG } from "./assets/asteroid.svg";
import { SpaceObject } from "src/lib/types";

interface AsteroidProps {
  params: SpaceObject;
}

export default function Asteroid({ params }: AsteroidProps) {
  return (
    <div
      className="asteroid"
      id={params.id}
      style={{
        position: "absolute",
        left: params.x,
        top: params.y,
        width: 2 * params.r,
        height: 2 * params.r,
        transform: `rotate(${params.rotation}deg)`,
      }}
    >
      <AsteroidSVG width={2 * params.r} height={2 * params.r} />
    </div>
  );
}
