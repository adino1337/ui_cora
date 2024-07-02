import { Draggable } from "react-beautiful-dnd";

export default function Field({ props }) {
  if (props.row.length === 2) {
    if (props.stencil === "15|85")
      props.field.className =
        props.columnIndex === 0 ? "detail-small" : "detail-large";
    else if (props.stencil === "85|15")
      props.field.className =
        props.columnIndex === 0 ? "detail-large" : "detail-small";
    else if (props.stencil === "50|50") props.field.className = null;
  }
  let styles =
    props.field.type === "title"
      ? {
          border: "2px solid #101010",
        }
      : {};
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
          className="field"
          ref={providedField.innerRef}
          {...providedField.draggableProps}
          {...providedField.dragHandleProps}
          style={{
            ...styles,
            ...providedField.draggableProps.style,
          }}
        >
          {props.edit && (
            <div
              className="delete"
              onClick={() => {
                props.field.type === "title"
                  ? props.deleteField(
                      props.rowIndex,
                      props.columnIndex,
                      props.fieldIndex,
                      "title"
                    )
                  : props.deleteField(
                      props.rowIndex,
                      props.columnIndex,
                      props.fieldIndex,
                      "UIBlock"
                    );
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
