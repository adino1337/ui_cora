import "./CustomComponents.css"
import LineBtn from "./addButtons/LineBtn"

// here add buttuns to add component to build area
// DO NOT FORGET TO SET TYPE IN ./customComponentsConfig.js
export default function CustomComponents(props) {
  return (
    <div className="components">
      <LineBtn setBuildArea={props.setBuildArea} />
    </div>
  );
}
