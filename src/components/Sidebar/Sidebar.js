import { useState } from "react";
import "./Sidebar.css";
import Panel from "./Panel";
import PanelClose from "./PanelClose";

export default function Sidebar(props) {
  const [sidePanel, setSidePanel] = useState(true);

  if (props.orientation !== "horizontal" && props.edit) {
    return (
      <div
        className={`side-panel ${sidePanel ? "expanded" : "collapsed"}`}
        //Rework open/close handler
        onClick={(e) => {
          if (
            e.target.className === "close-panel-icon" ||
            e.target.className === "side-panel expanded"
          )
            setSidePanel(false);
          else setSidePanel(true);
        }}
      >
        {sidePanel ? (
          <PanelClose title={props.title} children={props.children} isHorizontal={false} setSidePanel={setSidePanel}/>
        ) : (
          <Panel title={props.title} isHorizontal={false} setSidePanel={setSidePanel} />
        )}
      </div>
    );
  } else if (props.edit) {
    return (
      <div
        className="horizontal-side-panel"
        style={{
          minHeight: sidePanel ? "150px" : "40px",
          height: sidePanel ? "150px" : "40px",
          backgroundColor: props.bgColor,
          position: "relative",
          width: sidePanel && "calc(100% - 40px)",
          cursor: "pointer",
        }}
        onClick={(e) => {
          if (
            e.target.className === "close-panel-icon-horizontal" ||
            e.target.className === "horizontal-side-panel"
          )
            setSidePanel(false);
          else setSidePanel(true);
        }}
      >
        {sidePanel ? (
          <PanelClose title={props.title} children={props.children} isHorizontal={true} setSidePanel={setSidePanel}/>
        ) : (
          <Panel title={props.title} isHorizontal={true} setSidePanel={setSidePanel} />
        )}
      </div>
    );
  }
}
