import styles from "./Attribution.module.sass";
import attributions from "./data/attributions.json";
import TextPageBase from "src/components/TextPageBase/TextPageBase";

export default function Attribution() {
  return (
    <TextPageBase title="Attribution">
      <div className={styles.content}>
        <p>
          This project was bootstrapped with{" "}
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            Vite
          </a>
          &nbsp;. In addition it has these direct dependencies:
        </p>
        {attributions.map((attribution) => (
          <div className={styles.card} key={attribution.name}>
            <h2>{attribution.name}</h2>
            <p>Author: {attribution.author}</p>
            <p>License: {attribution.licenseType}</p>
            <p>
              Repo link: <a href={attribution.link}>{attribution.link}</a>
            </p>
          </div>
        ))}
        <div className={styles.gfx}>
          <div>
            SVGs from{" "}
            <a href="https://svgrepo.com/" target="_blank" rel="noreferrer">
              svgrepo.com
            </a>
            <ul>
              <li>
                <a
                  href="https://www.svgrepo.com/svg/440526/space-ship"
                  target="_blank"
                  rel="noreferrer"
                >
                  Space ship
                </a>
              </li>
              <li>
                <a
                  href="https://www.svgrepo.com/svg/48424/asteroid"
                  target="_blank"
                  rel="noreferrer"
                >
                  Asteroid
                </a>
              </li>
            </ul>
          </div>
          <div>
            Space background from{" "}
            <a
              href="https://unsplash.com/photos/zzi-6FCQtF8"
              target="_blank"
              rel="noreferrer"
            >
              unsplash.com
            </a>
          </div>
        </div>
      </div>
    </TextPageBase>
  );
}
