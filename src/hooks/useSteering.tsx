import { useEffect, useState } from "react";
import { Size } from "src/lib/types";
import { registerListener } from "src/lib/utils";

interface Steer {
  direction: Direction;
  leftDown: boolean;
  rightDown: boolean;
  fire: boolean;
  pause: boolean;
  aim?: number;
}

export enum Direction {
  NONE,
  LEFT,
  RIGHT,
}

const INIT_STEER: Steer = {
  direction: Direction.NONE,
  leftDown: false,
  rightDown: false,
  fire: false,
  aim: undefined,
  pause: false,
};

export const isTouchDevice =
  "ontouchstart" in window || navigator.maxTouchPoints > 0;

interface props {
  size: Size;
  onFire: (newFire: boolean) => void;
  onUsingKeyboard: () => void;
  preventDefault: boolean;
}

export function useSteering({
  size,
  onFire,
  onUsingKeyboard,
  preventDefault,
}: props) {
  const [steer, setSteer] = useState<Steer>(INIT_STEER);

  const [usingKeyboard, setUsingKeyboard] = useState(!isTouchDevice);

  useEffect(() => {
    const onKeyDown = (ev: KeyboardEvent) => {
      if (ev.repeat) return;
      if (!usingKeyboard) {
        setUsingKeyboard(true);
        onUsingKeyboard();
      }
      switch (ev.key) {
        case "a":
        case "ArrowLeft":
          setSteer({ ...steer, leftDown: true, direction: Direction.LEFT });
          break;
        case "d":
        case "ArrowRight":
          setSteer({ ...steer, rightDown: true, direction: Direction.RIGHT });
          break;
        case "w":
        case " ":
        case "ArrowUp":
          setSteer({ ...steer, fire: true });
      }
    };

    const onKeyUp = (ev: KeyboardEvent) => {
      switch (ev.key) {
        case "a":
        case "ArrowLeft":
          if (steer.rightDown) {
            setSteer({ ...steer, leftDown: false });
          } else {
            setSteer({
              ...steer,
              rightDown: false,
              leftDown: false,
              direction: Direction.NONE,
            });
          }
          break;
        case "d":
        case "ArrowRight":
          if (steer.leftDown) {
            setSteer({ ...steer, rightDown: false });
          } else {
            setSteer({
              ...steer,
              rightDown: false,
              leftDown: false,
              direction: Direction.NONE,
            });
          }
          break;
        case "w":
        case " ":
        case "ArrowUp":
          setSteer({ ...steer, fire: false });
          break;
      }
    };

    function getAim(x: number, y: number): number {
      const radians = Math.atan2(y, x);
      let degrees = (radians * 180) / Math.PI;
      if (degrees < 0) {
        degrees += 360;
      }
      return -degrees;
    }

    const onTouchStart = (ev: TouchEvent) => {
      let leftDown = false;
      let rightDown = false;
      let fire = false;
      let direction = Direction.NONE;
      let aim: undefined | number = undefined;
      let pause = false;

      if (ev.touches.length > 1) {
        fire = true;
        direction = Direction.NONE;
        leftDown = false;
        rightDown = false;
      } else {
        const cx = ev.touches[0].clientX;
        const cy = ev.touches[0].clientY;

        if (cx > size.width - 80 && cy < 80) {
          pause = true;
        } else {
          const x = cx - size.width / 2;
          const y = size.height / 2 - cy;
          aim = getAim(x, y);
        }
      }
      setSteer((prev) => {
        aim = aim ? minDiffRotation(aim, prev.aim) : undefined;
        return {
          leftDown,
          rightDown,
          direction,
          fire,
          aim,
          pause,
        };
      });
    };

    function unwrap(angle: number) {
      const n = Math.sign(angle) * Math.floor(Math.abs(angle) / 360);
      return angle - n * 360;
    }

    function minDiffRotation(newA: number, oldA: number | undefined) {
      const prev = oldA ? oldA : -90;
      const oldUnwrapped = unwrap(prev);

      let aDiff = newA - oldUnwrapped;
      if (aDiff > 180) {
        aDiff -= 360;
      } else if (aDiff < -180) {
        aDiff += 360;
      }
      return prev + aDiff;
    }

    const onTouchMove = (ev: TouchEvent) => {
      ev.preventDefault();
      const x = ev.touches[0].clientX - size.width / 2;
      const y = size.height / 2 - ev.touches[0].clientY;
      let aim = getAim(x, y);

      setSteer((prev) => {
        aim = minDiffRotation(aim, prev.aim);
        return { ...prev, aim };
      });
    };

    const onTouchEnd = (ev: TouchEvent) => {
      if (preventDefault) ev.preventDefault();
      let fire = false;
      if (!steer.pause) {
        if (ev.touches.length > 1) {
          console.warn("more than one touch onTouchend");
          fire = true;
        } else if (ev.touches.length === 0) {
          // All fingers released, stop turning and boosting
          fire = true;
        }
      }
      setSteer({
        ...steer,
        fire,
      });
    };

    const onContext = (e: MouseEvent) => {
      e.preventDefault();
    };

    const unregisterKeydown = registerListener("keydown", onKeyDown);
    const unregisterKeyup = registerListener("keyup", onKeyUp);

    const unregisterTouchStart = registerListener("touchstart", onTouchStart);
    const unregisterTouchEnd = registerListener("touchend", onTouchEnd);
    const unregisterTouchMove = registerListener("touchmove", onTouchMove);

    const unregisterContextMenu = registerListener("contextmenu", onContext);

    return () => {
      unregisterKeydown();
      unregisterKeyup();
      unregisterTouchStart();
      unregisterTouchEnd();
      unregisterTouchMove();
      unregisterContextMenu();
    };
  }, [steer, size, preventDefault, usingKeyboard, onUsingKeyboard]);

  useEffect(() => {
    onFire(steer.fire);
  }, [steer.fire, onFire]);

  useEffect(() => {
    if (preventDefault) {
      setSteer(INIT_STEER);
    }
  }, [preventDefault]);

  return steer;
}
