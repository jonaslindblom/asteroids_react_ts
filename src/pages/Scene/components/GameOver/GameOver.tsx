import styles from "./GameOver.module.sass";
import { useState, useEffect } from "react";
import { useLocalStorage } from "src/hooks/useLocalStorage";
import Button from "src/components/Button";
import Portal from "src/components/Portal";
import { useNavigate } from "react-router-dom";

interface GameOverProps {
  score: number;
  hitPercentage: number;
  onPlayAgain: () => void;
  container: Element;
}

function happiness(s: number) {
  if (s === 0) {
    return "🤪";
  } else if (s < 10) {
    return "😏";
  } else if (s < 30) {
    return "🙄";
  } else {
    return "👍🏻";
  }
}

export default function GameOver({
  score,
  hitPercentage,
  onPlayAgain,
  container,
}: GameOverProps) {
  const [highScore, setHighScore] = useLocalStorage("highscore", 0);
  const [isHighScore, setIsHighScore] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      setIsHighScore(true);
    }
  }, [score, highScore, setHighScore]);

  const msg = isHighScore ? (
    <div className={styles.gameOverContent}>
      <div className={styles.party}>🥳</div>
      Congrats, new device high score: <strong>{score}</strong> <br />
      <br />
      Hit accuracy: {hitPercentage}% <br />
    </div>
  ) : (
    <div className={styles.gameOverContent}>
      <div className={styles.party}>{happiness(score)}</div>
      Your score: <strong>{score}</strong> <br />
      <br />
      Hit efficiency: {hitPercentage}% <br />
      <br />
      Device high score: {highScore} <br />
    </div>
  );

  return (
    <Portal title="Game Over" container={container}>
      <div className={styles.gameOver}>
        <div className={styles.messageContainer}>{msg}</div>
        <div className={styles.actionsContainer}>
          <Button onClick={() => navigate("/")} classes={styles.okBtn}>
            I&apos;M DONE!
          </Button>
          <Button onClick={onPlayAgain} classes={styles.okBtn}>
            PLAY AGAIN!
          </Button>
        </div>
      </div>
    </Portal>
  );
}
