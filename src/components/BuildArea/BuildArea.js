import { Droppable } from "react-beautiful-dnd";
import Sidebar from "../Sidebar/Sidebar";
import "./BuildArea.css";
import Row from "./Row/Row";
import AddRowWithField from "./dropzones/AddRowWithField";
import CustomComponents from "./customComponents/CustomComponents";

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
              edit={props.edit}
              title="Ďalšie komponenty"
              even={false}
              children={props.children}
              orientation="horizontal"
            >
              <CustomComponents setBuildArea={props.setBuildArea}/>
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
