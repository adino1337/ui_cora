import { Droppable, Draggable } from "react-beautiful-dnd";
import Field from "../Field/Field";
import "./Column.css";

export default function Column({ props }) {
  return (
    <Draggable
      key={`column-${props.rowIndex}-${props.columnIndex}-grab`}
      draggableId={`column-${props.rowIndex}-${props.columnIndex}-grab`}
      index={props.columnIndex}
      type="column"
      isDragDisabled={!props.edit}
    >
      {(providedField) => {
        return (
          <div
            ref={providedField.innerRef}
            {...providedField.draggableProps}
            {...providedField.dragHandleProps}
            className={`column ${props.edit ? "column-edit" : ""}`}
          >
            <Droppable
              key={`column-${props.rowIndex}-${props.columnIndex}`}
              droppableId={`column-${props.rowIndex}-${props.columnIndex}`}
              direction="vertical"
              type="field"
            >
              {(providedCol, snapshot) => {
                return (
                  <div
                    ref={providedCol.innerRef}
                    className={`column-droppable ${snapshot.isDraggingOver ? "dragging-over" : ""}`}
                    {...providedCol.droppableProps}
                  >
                    {props.column.map((field, fieldIndex) => (
                      <Field
                        key={fieldIndex}
                        props={{ ...props, field, fieldIndex }}
                      />
                    ))}
                    {providedCol.placeholder}
                  </div>
                );
              }}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
}
