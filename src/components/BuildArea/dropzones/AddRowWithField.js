import AddRowWithColumn from "./AddRowWithColumn";
import { Droppable } from "react-beautiful-dnd";

export default function AddRowWithField(props) {
  return (
    <Droppable
      key={`addRow`}
      droppableId={`addRow`}
      direction="vertical"
      type="field"
    >
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            className={`plusRow ${
              snapshot.isDraggingOver ? "draggingOver" : ""
            }`}
            {...provided.droppableProps}
          >
            <AddRowWithColumn buildArea={props.buildArea} />
          </div>
        );
      }}
    </Droppable>
  );
}
