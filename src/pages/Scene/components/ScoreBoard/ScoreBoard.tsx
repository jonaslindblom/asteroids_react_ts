import styles from "./ScoreBoard.module.sass";
import { ScoreData } from "src/lib/types";

interface ScoreBoardProps {
  scoreData: ScoreData;
}

export default function ScoreBoard({ scoreData }: ScoreBoardProps) {
  return (
    <div className={styles.scoreBoard}>
      <div className={styles.score}>
        <span>Score: </span>
        <span>{scoreData.score}</span>
      </div>
      <div className={styles.efficiency}>
        <span>{scoreData.hitRate}%</span>
      </div>
    </div>
  );
}
