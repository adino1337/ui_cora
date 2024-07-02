import { useState } from "react";
import "./Sidebar.css";
import Panel from "./Panel";
import PanelClose from "./PanelClose";

export default function Sidebar(props) {
  const [sidePanel, setSidePanel] = useState(true);

  console.log(props)
  if (props.orientation !== "horizontal" && props.edit) {
    return (
      <div
        className={`side-panel ${sidePanel ? "expanded" : "collapsed"} ${props.even ? "even" : "odd"}`}
        //Rework open/close handler
        onClick={(e) => {
          if (
            e.target.className === "close-panel-icon" ||
            e.target.className === "side-panel expanded even" ||
            e.target.className === "side-panel expanded odd"
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
        className={`horizontal-side-panel ${sidePanel ? "horizontal-expanded" : "horizontal-collapsed"} ${props.even ? "even" : "odd"}`}
        onClick={(e) => {
          if (
            e.target.className === "close-panel-icon-horizontal" ||
            e.target.className === "horizontal-side-panel horizontal-expanded even" ||
            e.target.className === "horizontal-side-panel horizontal-expanded odd"
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
