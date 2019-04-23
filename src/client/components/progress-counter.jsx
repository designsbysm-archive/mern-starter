import React from "react";

//assets
import "../styles/components/progress.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/pro-regular-svg-icons";

const Progress = ({ close, max, title, value }) => {
  const oneHundredPercent = Math.PI * 80;
  const precent = value / max;

  return (
    <div className="progress-box">
      <div className="close" onClick={() => close()}>
        <FontAwesomeIcon className="icon" icon={faTimes} />
      </div>

      <svg className="spinner" viewBox="0 0 160 130">
        <path
          className="tail"
          d="M 80,65
            m 0,-40
            a 40,40 0 1 0 0,80
            a 40,40 0 1 0 0,-80"
        />
        <path
          className="progress"
          d="M 80,65
            m 0,-40
            a 40,40 0 1 0 0,80
            a 40,40 0 1 0 0,-80"
          strokeDasharray={oneHundredPercent}
          strokeDashoffset={-`${oneHundredPercent - oneHundredPercent * precent}`}
        />
      </svg>
      <div className="title">{`${title || "Running"}: ${value || "###"}`}</div>
    </div>
  );
};

export default Progress;
