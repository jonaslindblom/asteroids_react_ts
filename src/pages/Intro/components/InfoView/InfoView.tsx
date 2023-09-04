import styles from "./InfoView.module.sass";
import Button from "src/components/Button";
import Portal from "src/components/Portal";
import { QRCodeSVG } from "qrcode.react";

interface QRProps {
  onClose: () => void;
  container: Element;
}

const canShare = navigator.share !== undefined;
const supportsClipboard = typeof navigator.clipboard?.writeText === "function";

export default function QRView(props: QRProps) {
  return (
    <Portal title="About" container={props.container} onClose={props.onClose}>
      <div className={styles.content}>
        <div>
          <p>
            The game takes place in deep space 🛸👽💫, where your mission is to
            take out incoming asteroids ☄️. You get one point for each hit. But
            be careful, if you miss, you lose one point 😱
          </p>
          <p> You can play with keyboard ⌨️, gamepad 🎮 or touch 📱.</p>
          <p>
            Double the fun and <strong>share the game</strong> with your friends
            👦 👧. If nearby, just let them point their mobile camera at this
            screen and click the link showing up.
          </p>
        </div>
        <div className={styles.QRContainer} data-testid="qr-code">
          <QRCodeSVG
            value="https://jonaslindblom.github.io/asteroids/"
            bgColor="#2f4f4f"
            fgColor="lightgray"
          />
        </div>

        {supportsClipboard && (
          <div>
            <div className={styles.share}>
              {canShare ? (
                <p>Alternatively, share by clicking the buttons below.</p>
              ) : (
                <p>
                  Alternatively, copy a link to the game by clicking below and
                  share in a chat etc.
                </p>
              )}
            </div>
            <div className={styles.shareButtons}>
              {canShare && (
                <Button
                  onClick={() => {
                    navigator
                      .share({
                        title: "Asteroids",
                        url: "https://jonaslindblom.github.io/asteroids/",
                      })
                      .catch(console.error);
                  }}
                >
                  SHARE
                </Button>
              )}
              <Button
                onClick={() => {
                  navigator.clipboard
                    .writeText(window.location.href)
                    .catch(console.error);
                }}
              >
                COPY LINK
              </Button>
            </div>
          </div>
        )}

        <div className={styles.feedback}>
          Send feedback to <a href="mailto:jonas@tomatoracer.com">jonas</a>
        </div>
      </div>
    </Portal>
  );
}
