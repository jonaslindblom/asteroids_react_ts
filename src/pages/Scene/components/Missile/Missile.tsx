import { SpaceObject } from "src/lib/types";
import styles from "./Missile.module.sass";

interface MissileProps {
  params: SpaceObject;
}

export default function Comet({ params }: MissileProps) {
  return (
    <div
      className={styles.missile}
      style={{
        position: "absolute",
        left: params.x,
        top: params.y,
      }}
    >
      <svg
        width={2 * params.r}
        height={2 * params.r}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${2 * params.r} ${2 * params.r}`}
      >
        <circle cx={params.r} cy={params.r} r={params.r} fill="yellow" />
      </svg>
    </div>
  );
}
