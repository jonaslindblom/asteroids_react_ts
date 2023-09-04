import styles from "./Intro.module.sass";
import { useState, useRef } from "react";
import InfoView from "./components/InfoView";
import { ReactComponent as SpaceShip } from "src/pages/Scene/components/Ship/assets/ship.svg";
import { useLocalStorage } from "src/hooks/useLocalStorage";
import Button from "src/components/Button";
import { useNavigate, Link } from "react-router-dom";

export default function Intro() {
  const [showInfo, setShowInfo] = useState(false);
  const [highScore] = useLocalStorage("highscore", 0);

  const intro = useRef(null);
  const navigate = useNavigate();

  return (
    <div className="fadeIn">
      <div className={styles.container}>
        {!showInfo ? (
          <div className={styles.topButtons}>
            <button
              className={styles.infoButton}
              onClick={() => {
                setShowInfo(true);
              }}
              data-testid="info-button"
            >
              ?
            </button>
          </div>
        ) : undefined}
        <div className={styles.content} ref={intro}>
          {intro.current && showInfo && (
            <InfoView
              container={intro.current}
              onClose={() => {
                setShowInfo(false);
              }}
            />
          )}
          <div className={styles.version} data-testid="version">
            v. {process.env.VERSION}
          </div>
          <div className={styles.logo}>
            <div className={styles.prefix}>Incoming</div>
            <div className={styles.title}>
              <strong>Asteroids</strong>
            </div>
            <div className={styles.suffix}>from Jonas&apos; deep space</div>
          </div>
          <div className={styles.ship}>
            <SpaceShip />
          </div>
          <div className={styles.playButtons}>
            <Button
              classes={styles.playButton}
              onClick={() => {
                navigate("/play");
              }}
              data-testid="play-button"
            >
              Let&rsquo;s play!
            </Button>
          </div>
          <div className={styles.highscore}>Device high score: {highScore}</div>
          <div className={styles.bottomButtons}>
            <Link to="/attribution">Attribution</Link>
            <Link to="/privacy">Privacy Policy</Link>
          </div>
          <div className={styles.bottomSpace}></div>
        </div>
      </div>
    </div>
  );
}
