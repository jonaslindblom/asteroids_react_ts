import styles from "./Portal.module.sass";
import ReactDom from "react-dom";
import React, { useRef } from "react";

interface props {
  title: string;
  onClose?: () => void | undefined;
  container: Element;
  children: React.ReactNode;
}

export default function Portal({ title, container, onClose, children }: props) {
  const ref = useRef<HTMLDivElement>(null);

  function closePortal(e: React.MouseEvent) {
    e.stopPropagation();
    if (ref.current && onClose) {
      onClose();
    }
  }

  return ReactDom.createPortal(
    <div className={`${styles.darkBG} fadeIn`} ref={ref}>
      <div className={styles.centered}>
        <div
          className={styles.component}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          {onClose && (
            <div className={styles.close}>
              <button onClick={closePortal}>X</button>
            </div>
          )}
          <h5 className={styles.heading}>
            <strong>{title}</strong>
          </h5>

          {children}
        </div>
      </div>
    </div>,
    container
  );
}
