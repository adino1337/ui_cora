import React from 'react';
import { ArrowRight, ArrowDown} from "lucide-react";
import "./Sidebar.css";

const Panel = ({ title, isHorizontal, setSidePanel }) => {
  return (
    <>
      <h3 className={isHorizontal ? "side-panel-title-horizontal-open" : "sidewaysText"}>{title}</h3>
      <h1
        className={isHorizontal ? "open-panel-icon-horizontal" : "open-panel-icon"}
        onClick={() => setSidePanel(true)}
      >
        {isHorizontal ? <ArrowDown /> : <ArrowRight />}
      </h1>
      <div className="side-panel-bg"></div>
    </>
  );
}

export default Panel;