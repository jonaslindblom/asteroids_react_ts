import styles from "./Scene.module.sass";
import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useLayoutEffect,
} from "react";
import {
  registerListener,
  getRandomStartingPoint,
  hitPercentage,
} from "src/lib/utils";
import { Size } from "src/lib/types";
import Ship from "./components/Ship/Ship";
import Missile from "./components/Missile/Missile";
import Asteroid from "./components/Asteroid/Asteroid";
import { Direction, isTouchDevice, useSteering } from "../../hooks/useSteering";
import GameOver from "./components/GameOver/GameOver";
import { SpaceObject, ScoreData } from "src/lib/types";
import {
  ASTEROID_RADIUS,
  ASTEROID_SPEED,
  MISSILE_RADIUS,
  MISSILE_SPEED,
  SHIP_WIDTH,
  SHIP_ROTATION_SPEED,
} from "src/lib/constants";
import { pollGamepad } from "src/lib/gamepad";
import ScoreBoard from "./components/ScoreBoard/ScoreBoard";

const Scene = () => {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  const [size, setSize] = useState<Size>({ width: 0, height: 0 });
  const shipRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState(-90);
  const [asteroids, setAsteroids] = useState<SpaceObject[]>([]);
  const [missiles, setMissiles] = useState<SpaceObject[]>([]);
  const [scoreData, setScoreData] = useState<ScoreData>({
    score: 0,
    fired: 0,
    hits: 0,
    hitRate: 0,
  });
  const [gamepadFired, setGamepadFired] = useState(false);

  const [isUsingKeyboard, setIsUsingKeyboard] = useState(!isTouchDevice);
  const [isGameOver, setIsGameOver] = useState(false);
  const [paused, setPaused] = useState(false);

  function onPlayAgain() {
    setRotation(-90);
    setAsteroids([]);
    setMissiles([]);
    setScoreData({ score: 0, fired: 0, hits: 0, hitRate: 0 });
    shipRef.current?.classList.remove(styles.explode);
    setIsGameOver(false);
    setPaused(false);
  }

  const addMissile = useCallback(() => {
    const shipRect = shipRef.current?.getBoundingClientRect();
    if (!shipRect) return;

    let direction = 0;
    let x = 0;
    let y = 0;

    // using setters to access otherwise stale states since called from event handler
    setRotation((prev) => {
      direction = prev;
      return prev;
    });

    setSize((prevSize) => {
      x = prevSize.width / 2 - MISSILE_RADIUS;
      y = prevSize.height / 2 - MISSILE_RADIUS;

      return prevSize;
    });

    setMissiles((prev) => {
      return [
        ...prev,
        {
          id: Math.random().toString(),
          x,
          y,
          r: MISSILE_RADIUS,
          direction,
          speed: MISSILE_SPEED,
        },
      ];
    });
  }, []);

  const addRandomAsteroid = useCallback(() => {
    if (paused || isGameOver) return;
    setSize((prev) => {
      const size = Math.floor(3 * Math.random() + 1) * ASTEROID_RADIUS;
      const { x, y, direction } = getRandomStartingPoint(prev, size);
      setAsteroids((prev) => {
        return [
          ...prev,
          {
            id: Math.random().toString(),
            x,
            y,
            r: size,
            direction,
            speed: (3 * ASTEROID_SPEED) / size,
            rotation: Math.random() * 360,
            rotationDir: Math.random() < 0.5 ? 1 : -1,
          },
        ];
      });

      return prev;
    });
  }, [paused, isGameOver]);

  const addAsteroid = useCallback(
    (x: number, y: number, direction: number, size: number) => {
      setSize((prev) => {
        setAsteroids((prev) => {
          return [
            ...prev,
            {
              id: Math.random().toString(),
              x,
              y,
              r: size,
              direction,
              speed: (3 * ASTEROID_SPEED) / size,
              rotation: Math.random() * 360,
              rotationDir: Math.random() < 0.5 ? -1 : 1,
            },
          ];
        });

        return prev;
      });
    },
    []
  );

  const onFire = useCallback(
    (fire: boolean) => {
      if (fire) {
        addMissile();
        setScoreData((prev) => ({
          ...prev,
          fired: prev.fired + 1,
          hitRate: hitPercentage(prev.hits, prev.fired + 1),
        }));
      }
    },
    [addMissile]
  );

  const steer = useSteering({
    size,
    onFire,
    onUsingKeyboard: () => setIsUsingKeyboard(true),
    preventDefault: !(isGameOver || paused),
  });

  function onResize() {
    if (!sceneRef.current) return;
    const { width, height } = sceneRef.current.getBoundingClientRect();
    setSize({ width: width, height: height });
  }

  const isOnCanvas = useCallback(
    (o: SpaceObject) => {
      const r = o.r;
      return (
        o.x >= -2 * r &&
        o.x <= size.width &&
        o.y >= -2 * r &&
        o.y <= size.height
      );
    },
    [size]
  );

  const moveAsteroids = useCallback(() => {
    setAsteroids((prev) =>
      prev.filter(isOnCanvas).map((a) => ({
        ...a,
        x: a.x + Math.cos((a.direction * Math.PI) / 180) * a.speed,
        y: a.y + Math.sin((a.direction * Math.PI) / 180) * a.speed,
        rotation:
          a.rotation && a.rotationDir ? a.rotation + a.rotationDir : undefined,
      }))
    );
  }, [isOnCanvas]);

  const bounceScore = useCallback(() => {
    scoreRef.current?.classList.remove(styles.grow);
    setTimeout(() => {
      scoreRef.current?.classList.add(styles.grow);
    }, 100);
  }, [scoreRef]);

  const moveMissiles = useCallback(() => {
    setMissiles((prev) => {
      const alive = prev.filter(isOnCanvas).map((m) => ({
        ...m,
        x: m.x + Math.cos((m.direction * Math.PI) / 180) * MISSILE_SPEED,
        y: m.y + Math.sin((m.direction * Math.PI) / 180) * MISSILE_SPEED,
      }));
      const nOffscreen = prev.length - alive.length;
      setScoreData((prev) => ({
        ...prev,
        score: Math.max(prev.score - nOffscreen, 0),
      }));
      if (nOffscreen > 0) {
        bounceScore();
      }
      return alive;
    });
  }, [isOnCanvas, bounceScore]);

  const shipHit = useCallback(
    (a: SpaceObject) => {
      if (a.isHit) {
        return false;
      }
      const d = Math.sqrt(
        (a.x + a.r - size.width / 2) ** 2 + (a.y + a.r - size.height / 2) ** 2
      );
      return d < a.r + SHIP_WIDTH / 4;
    },
    [size]
  );

  function isOverlapping(a: SpaceObject, b: SpaceObject) {
    const d = Math.sqrt(
      (a.x + a.r - b.x - b.r) ** 2 + (a.y + a.r - b.y - b.r) ** 2
    );
    return d < a.r + b.r;
  }

  const isAsteroidHitByMissile = useCallback(
    (a: SpaceObject) => {
      if (a.isHit) {
        return false;
      }

      for (const m of missiles) {
        if (isOverlapping(a, m)) {
          setMissiles((prevMissiles) =>
            prevMissiles.filter((p) => {
              return p.id !== m.id;
            })
          );
          return true;
        }
      }
      return false;
    },
    [missiles]
  );

  const handleAsteroidExploded = useCallback((event: AnimationEvent) => {
    const el: HTMLElement = event.target as HTMLElement;
    setAsteroids((prev) => prev.filter((p) => p.id !== el.id));
  }, []);

  const handleShipExploded = useCallback(() => {
    shipRef.current?.classList.remove("explode");
    setIsGameOver(true);
  }, [shipRef]);

  const checkMissileAsteroidHits = useCallback(() => {
    setAsteroids((prev) => {
      const hits = prev.filter(isAsteroidHitByMissile);
      const hitIds = hits.map((h) => h.id);

      if (hits.length > 0) {
        setScoreData((prev) => ({
          ...prev,
          score: prev.score + hits.length,
          hits: prev.hits + hits.length,
          hitRate: hitPercentage(prev.hits + hits.length, prev.fired),
        }));
        bounceScore();
      }

      return prev.map((p) => {
        if (hitIds.includes(p.id)) {
          const el = document.getElementById(p.id);
          el?.classList.add(styles.explode);
          el?.addEventListener("animationend", handleAsteroidExploded);
          const asize = p.r / ASTEROID_RADIUS;
          if (asize > 1) {
            addAsteroid(
              p.x,
              p.y,
              p.direction - 15 + Math.random() * 10,
              (asize - 1) * ASTEROID_RADIUS
            );
            addAsteroid(
              p.x,
              p.y,
              p.direction + 15 + Math.random() * 10,
              (asize - 1) * ASTEROID_RADIUS
            );
          }
          return { ...p, isHit: true };
        } else {
          return p;
        }
      });
    });
  }, [
    isAsteroidHitByMissile,
    bounceScore,
    handleAsteroidExploded,
    addAsteroid,
  ]);

  const checkShipAsteroidCollisions = useCallback(() => {
    asteroids.forEach((a) => {
      if (shipRef.current && shipHit(a)) {
        shipRef.current.classList.add(styles.explode);
        shipRef.current.style.transform = `rotate(${90 + rotation}deg)`;
        shipRef.current.addEventListener("animationend", handleShipExploded);
      }
    });
  }, [asteroids, rotation, shipHit, handleShipExploded]);

  const shipStyle = useMemo(() => {
    return {
      transform: `rotate(${90 + rotation}deg)`,
      transition: isUsingKeyboard ? undefined : "transform 0.2s ease-out",
    };
  }, [rotation, isUsingKeyboard]);

  function onVisibilityChange() {
    console.log("visibility change, now:", document.visibilityState);
    if (document.visibilityState === "hidden") {
      console.log("setting paused ...");
      setPaused(true);
    } else {
      console.log("unpausing");
      setPaused(false);
    }
  }

  // Init effect
  useEffect(() => {
    if (isGameOver) return;
    const unregisterResizeListener = registerListener("resize", onResize);
    const unregisterVisibilityListener = registerListener(
      "visibilitychange",
      onVisibilityChange
    );

    onResize();

    const iv = setInterval(() => {
      addRandomAsteroid();
    }, 1000);

    return () => {
      unregisterResizeListener();
      unregisterVisibilityListener();
      clearInterval(iv);
    };
  }, [addRandomAsteroid, isGameOver]);

  useLayoutEffect(() => {
    const gameLoop = () => {
      if (paused || isGameOver) return;

      moveAsteroids();
      moveMissiles();
      checkShipAsteroidCollisions();
      checkMissileAsteroidHits();

      const { gpTurn, gpFire } = pollGamepad();

      if (steer.aim) {
        setRotation(steer.aim);
      } else if (steer.direction === Direction.LEFT) {
        setRotation((prevRotation) => prevRotation - SHIP_ROTATION_SPEED);
      } else if (steer.direction === Direction.RIGHT) {
        setRotation((prevRotation) => prevRotation + SHIP_ROTATION_SPEED);
      } else if (gpTurn) {
        setRotation(
          (prevRotation) => prevRotation + gpTurn * SHIP_ROTATION_SPEED
        );
      }

      if (gpFire) {
        // Only fire if button is not already pressed
        onFire(!gamepadFired);
        setGamepadFired(true);
      } else {
        // Make it possible to fire again
        setGamepadFired(false);
      }
      rafRef.current = requestAnimationFrame(gameLoop);
    };

    rafRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [
    paused,
    isGameOver,
    steer,
    onFire,
    gamepadFired,
    moveAsteroids,
    moveMissiles,
    checkShipAsteroidCollisions,
    checkMissileAsteroidHits,
  ]);

  return (
    <div className={styles.root} ref={rootRef}>
      <div className={styles.scene} ref={sceneRef}>
        {asteroids.map((a) => {
          return <Asteroid params={a} key={a.id} />;
        })}

        {missiles.map((m) => {
          return <Missile params={m} key={m.id} />;
        })}

        <div ref={shipRef} style={shipStyle}>
          <Ship />
        </div>
      </div>

      <div ref={scoreRef} className={styles.scoreBoard}>
        <ScoreBoard scoreData={scoreData} />
      </div>

      {isGameOver && rootRef.current && (
        <GameOver
          score={scoreData.score}
          hitPercentage={hitPercentage(scoreData.hits, scoreData.fired)}
          onPlayAgain={onPlayAgain}
          container={rootRef.current}
        />
      )}
    </div>
  );
};

export default Scene;
