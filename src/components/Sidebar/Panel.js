import { useState } from "react";
import "./Sidebar.css";
import PanelOpenClose from "./PanelOpenClose";

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
            <PanelOpenClose title={title} children={children} isHorizontal={isHorizontal} setSidePanel={setSidePanel} isOpen={!sidePanel}/>
          ) : (
            <PanelOpenClose title={title} children={children} isHorizontal={isHorizontal} setSidePanel={setSidePanel} isOpen={!sidePanel}/>
          )}
        </div>
      );
}

export default Panel;