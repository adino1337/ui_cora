import { Droppable } from "react-beautiful-dnd";
import Sidebar from "../Sidebar/Sidebar";
import "./BuildArea.css";
import Row from "./Row/Row";
import LineBtn from "./customComponents/addButtons/LineBtn";
import AddRowWithField from "./dropzones/AddRowWithField";

export default function BuildArea(props) {
  return (
    <Droppable
      key={`base`}
      droppableId={`base`}
      direction="vertical"
      type="row"
    >
      {(providedBase) => {
        return (
          <div
            ref={providedBase.innerRef}
            className="right-panel"
            {...providedBase.droppableProps}
          >
            <Sidebar
              orientation="horizontal"
              title="Ďalšie komponenty"
              bgColor="#e2e2e2"
              nextBgColor="#fff"
              edit={props.edit}
            >
              <LineBtn setBuildArea={props.setBuildArea} />
            </Sidebar>

            {props.buildArea.map((row, rowIndex) => (
              <Row key={rowIndex} props={{ ...props, row, rowIndex }} />
            ))}
            {providedBase.placeholder}

            {props.edit && <AddRowWithField buildArea={props.buildArea} />}
          </div>
        );
      }}
    </Droppable>
  );
}
