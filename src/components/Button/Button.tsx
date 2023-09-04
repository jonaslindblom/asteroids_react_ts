import React from "react";
import styles from "./Button.module.sass";

interface ButtonProps {
  classes?: string;
}

export default function Button({
  classes,
  children,
  ...props
}: React.ButtonHTMLAttributes<unknown> & ButtonProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${classes} ${styles.button} `}
        type="button"
        {...props}
      >
        {children}
      </button>
    </div>
  );
}
