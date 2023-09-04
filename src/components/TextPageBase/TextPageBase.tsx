import styles from "./TextPageBase.module.sass";
import { ReactComponent as BackArrow } from "./assets/back.svg";
import { Link } from "react-router-dom";

interface TextPageBaseProps {
  title: string;
  children: React.ReactNode;
}

export default function TextPageBase({ title, children }: TextPageBaseProps) {
  return (
    <div className={styles.container}>
      <div className={styles.back}>
        <Link to="/">
          <BackArrow className={styles.backArrow} data-testid="back-arrow" />
        </Link>
      </div>
      <h1 className={styles.title}>{title}</h1>
      <div className={styles.children}>{children}</div>
    </div>
  );
}
