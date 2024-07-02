import { useState } from "react";
import "./Sidebar.css";
import PanelOpen from "./PanelOpen";
import PanelClose from "./PanelClose";

const Panel = ({ title, even, children, orientation }) => {
    const [sidePanel, setSidePanel] = useState(true);
    const horizontal = orientation === "horizontal" ? "horizontal-" : "";
    const isHorizontal = orientation === "horizontal" ? true : false;

    return (
        <div
          className={
            `${horizontal}side-panel ${sidePanel
            ? `${horizontal}expanded`
            : `${horizontal}collapsed`} ${even ? "even" : "odd"}`
        }
          onClick={!sidePanel ? () => setSidePanel(!sidePanel) : undefined}
        >
          {sidePanel ? (
            <PanelClose title={title} children={children} isHorizontal={isHorizontal} setSidePanel={setSidePanel}/>
          ) : (
            <PanelOpen title={title} isHorizontal={isHorizontal} setSidePanel={setSidePanel} />
          )}
        </div>
      );
}

export default Panel;