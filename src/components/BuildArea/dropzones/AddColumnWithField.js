import { Droppable } from "react-beautiful-dnd";

export default function AddColumnWithField(props) {
  return (
    <Droppable
      key={`addColumn-${props.rowIndex}`}
      droppableId={`addColumn-${props.rowIndex}`}
      direction="vertical"
      type="field"
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          className={`plusCol ${snapshot.isDraggingOver ? "dragging" : ""}`}
          {...provided.droppableProps}
        >
          +
        </div>
      )}
    </Droppable>
  );
}
