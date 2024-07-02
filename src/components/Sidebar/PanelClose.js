import React from "react";
import { ArrowLeft, ArrowUp } from "lucide-react";
import "./Sidebar.css";

const PanelClose = ({ title, children, isHorizontal, setSidePanel }) => {
    return (
    <>
        <h1
          className= {isHorizontal ? "close-panel-icon-horizontal" : "close-panel-icon"} 
          onClick={() => setSidePanel(false)}
        >
        {isHorizontal ? <ArrowUp/> : <ArrowLeft/>}
        </h1>
        <h4 className={isHorizontal ? "side-panel-title-horizontal" : "side-panel-title"}>{title}</h4>
        {isHorizontal ? <div className="components">{children}</div> : children}
        <div className="side-panel-bg"></div>
    </>
    );
}

export default PanelClose;