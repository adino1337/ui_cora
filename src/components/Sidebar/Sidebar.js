import React from "react";
import "./Sidebar.css";
import Panel from "./Panel";

export default function Sidebar({ edit, title, even, children, orientation }) {
  if (orientation !== "horizontal" && edit) {
    return (
      <Panel 
        edit={edit}
        title={title}
        even={even}
        children={children}
        orientation={orientation}
      />
    );
  } else if (edit) {
    return (
      <Panel
        title={title}
        even={even}
        children={children}
        orientation={orientation}
      />
    );
  }
}
