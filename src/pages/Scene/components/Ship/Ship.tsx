import { ReactComponent as SpaceShip } from "./assets/ship.svg";
import { SHIP_WIDTH } from "src/lib/constants";

export default function Ship() {
  return (
    <div>
      <SpaceShip width={SHIP_WIDTH} height={SHIP_WIDTH} />
    </div>
  );
}
