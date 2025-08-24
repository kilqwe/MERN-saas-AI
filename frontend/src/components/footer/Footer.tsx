import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        width: "100%",
        padding: "1.5rem 0",
        marginTop: "2rem",
        background: "transparent", // blends with page background
        textAlign: "center",
        fontSize: "16px",
        color: "#64f3d5", // matches your glowing teal
        fontFamily: "Work Sans, sans-serif",
        textShadow: "0px 0px 10px rgba(100, 243, 213, 0.6)",
      }}
    >
      Built with inspiration from the amazing tutorial by<span><Link className="nav-link" style={{color:"white"}} to={"https://www.youtube.com/watch?v=wrHTcjSZQ1Y&list=WL&index=2&t=812s"}>Indian Coders</Link></span>
      and freeCodeCamp
    </footer>
  );
};

export default Footer;
