import React from "react";

//assets
import "../styles/components/progress.scss";

const Spinner = ({ title }) => (
  <div className="progress-box">
    <svg className="spinner" viewBox="0 0 160 130">
      <path
        className="tail"
        d="M 80,65
          m 0,-40
          a 40,40 0 1 0 0,80
          a 40,40 0 1 0 0,-80"
      />
      <path
        id="progress"
        className="progress"
        d="M 80,65
          m 0,-40
          a 40,40 0 1 0 0,80
          a 40,40 0 1 0 0,-80"
        strokeDasharray={Math.PI * 80}
        strokeDashoffset="210"
      />
      <animateTransform
        attributeType="xml"
        attributeName="transform"
        type="rotate"
        from="0 0 0"
        to="360 0 0"
        dur="1.5s"
        repeatCount="indefinite"
      />
      <animate
        href="#progress"
        attributeType="xml"
        attributeName="stroke-dashoffset"
        dur="3s"
        repeatCount="indefinite"
        values="210; 50; 210;"
      />
    </svg>
    <div className="title">{title || "Loading..."}</div>
  </div>
);

export default Spinner;
