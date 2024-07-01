import { useState } from "react";
import "./Sidebar.css";
import { ArrowRight, ArrowLeft, ArrowDown, ArrowUp } from "lucide-react";

export default function Sidebar(props) {
  const [sidePanel, setSidePanel] = useState(true);

  if (props.orientation !== "horizontal" && props.edit) {
    return (
      <div
        className="side-panel"
        style={{
          width: sidePanel ? "15%" : "75px",
          backgroundColor: props.bgColor,
          cursor: "pointer",
          borderRight:
            props.theme === "light" ? "3px solid black" : "3px solid black",
        }}
        onClick={(e) => {
          if (
            e.target.className === "close-panel-icon" ||
            e.target.className === "side-panel"
          )
            setSidePanel(false);
          else setSidePanel(true);
        }}
      >
        {sidePanel ? (
          <>
            <h1
              className="close-panel-icon"
              onClick={() => {
                setSidePanel(false);
              }}
            >
              {<ArrowLeft />}
            </h1>
            <h4 className="side-panel-title">{props.title}</h4>
            {props.children}
            <div
              className="side-panel-bg"
              style={{ backgroundColor: props.nextBgColor }}
            ></div>
          </>
        ) : (
          <>
            <h1 className="sidewaysText">{props.title}</h1>
            <h1
              className="open-panel-icon"
              onClick={() => {
                setSidePanel(true);
              }}
            >
              {<ArrowRight />}
            </h1>
            <div
              className="side-panel-bg"
              style={{ backgroundColor: props.nextBgColor }}
            ></div>
          </>
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
          <>
            <h1
              className="close-panel-icon-horizontal"
              onClick={() => setSidePanel(false)}
            >
              {<ArrowUp />}
            </h1>

            <h4 className="side-panel-title-horizontal">{props.title}</h4>
            <div className="components">{props.children}</div>

            <div
              className="side-panel-bg"
              style={{ backgroundColor: props.nextBgColor }}
            ></div>
          </>
        ) : (
          <>
            <h3 className="side-panel-title-horizontal-open">{props.title}</h3>
            <h1
              className="open-panel-icon-horizontal"
              onClick={() => setSidePanel(true)}
            >
              {<ArrowDown />}
            </h1>
            <div
              className="side-panel-bg"
              style={{ backgroundColor: props.nextBgColor }}
            ></div>
          </>
        )}
      </div>
    );
  }
}
