import React from "react";

//assets
import "../styles/footer.scss";

const Footer = ({ title, version }) => {
  return (
    <footer>
      <div className="credits">
        <span>{title}</span> <span>v{version}</span>
      </div>
    </footer>
  );
};

export default Footer;
