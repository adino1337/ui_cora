import React from 'react';
import { ArrowRight, ArrowDown, ArrowLeft, ArrowUp } from "lucide-react";
import "./Sidebar.css";

const openTitle = (isHorizontal, title) => {
  return (
    <h3 className={isHorizontal ? "side-panel-title-horizontal-open" : "sidewaysText"}>{title}</h3>
  );
}

const closeTitle = (isHorizontal, title, children) => {
  return (
    <>
      <h4 className={isHorizontal ? "side-panel-title-horizontal" : "side-panel-title"}>{title}</h4>
      {isHorizontal ? <div className="components">{children}</div> : children}
    </>
  );
}

const arrows = (isHorizontal, isOpen) => {
  if (isOpen) {
    return isHorizontal ? <ArrowDown /> : <ArrowRight />;
  }

  return isHorizontal ? <ArrowUp/> : <ArrowLeft/>;
}

const PanelOpenClose = ({ title, children, isHorizontal, setSidePanel, isOpen }) => {
  console.log(isOpen);
  return (
    <>
      {isOpen && openTitle(isHorizontal, title)}  
      <h1
        className={isHorizontal ? "open-panel-icon-horizontal" : "open-panel-icon"}
        onClick={() => setSidePanel(isOpen)}
      >
        {arrows(isHorizontal, isOpen)}
      </h1>
      {!isOpen && closeTitle(isHorizontal, title, children)}
      <div className="side-panel-bg"></div>
    </>
  );
}

export default PanelOpenClose;