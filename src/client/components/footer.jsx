import React from "react";

const Footer = ({ title, version }) => {
  return (
    <footer>
      <div>
        <span>{title}</span> <span>v{version}</span>
      </div>
    </footer>
  );
};

export default Footer;
