import { Draggable } from "react-beautiful-dnd";
import "./Field.css";

export default function Field({ props }) {
  const deleteField = () =>
    props.deleteField(
      props.rowIndex,
      props.columnIndex,
      props.fieldIndex,
      "UIBlock"
    );
  const deleteTitle = () =>
    props.deleteField(
      props.rowIndex,
      props.columnIndex,
      props.fieldIndex,
      "title"
    );

  return (
    <Draggable
      key={props.field.field}
      draggableId={props.field.field}
      index={props.fieldIndex}
      type="field"
      isDragDisabled={!props.edit}
    >
      {(providedField) => (
        <div
          className={`field ${props.field.type === "title" ? "title" : ""}`}
          ref={providedField.innerRef}
          {...providedField.draggableProps}
          {...providedField.dragHandleProps}
          style={providedField.draggableProps.style}
        >
          {props.edit && (
            <div
              className="delete"
              onClick={() => {
                props.field.type === "title" ? deleteTitle() : deleteField();
              }}
            >
              X
            </div>
          )}
          <div>{props.field.title}</div>
        </div>
      )}
    </Draggable>
  );
}
