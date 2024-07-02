import { Droppable, Draggable } from "react-beautiful-dnd";
import Field from "./Field/Field";

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
        let styles = {
          ...providedField.draggableProps.style,
        };
        if (props.edit) styles = { ...styles, maxWidth: "200px" };

        return (
          <div
            ref={providedField.innerRef}
            {...providedField.draggableProps}
            {...providedField.dragHandleProps}
            style={styles}
            className="column"
          >
            <Droppable
              key={`column-${props.rowIndex}-${props.columnIndex}`}
              droppableId={`column-${props.rowIndex}-${props.columnIndex}`}
              direction="vertical"
              type="field"
            >
              {(providedCol, snapshot) => {
                let styles = snapshot.isDraggingOver
                  ? {
                      background: `linear-gradient(-45deg, #e2e2e2 25%, transparent 25%, transparent 50%, #e2e2e2 50%, #e2e2e2 75%, transparent 75%, transparent)`,
                      backgroundSize: "20px 20px",
                    }
                  : {};
                return (
                  <div
                    ref={providedCol.innerRef}
                    className="column-droppable"
                    {...providedCol.droppableProps}
                    style={styles}
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
