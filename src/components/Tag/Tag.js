import React from "react";
import styles from "./Tag.module.css";

function Tag(props) {
  return (
    <div
      className={`
      ${styles.tagWrapper}
      ${props.style === "warning" && styles.warningTag}
      ${props.hover && styles.tagHover}
      ${props.shadow && styles.addShadow}
      `}
    >
      {props.children}
    </div>
  );
}

export default Tag;
