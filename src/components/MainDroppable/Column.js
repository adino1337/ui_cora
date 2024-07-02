import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import Field from "./Field";

function RealColumn({ props }) {
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
        else if (props.stencil === "50|50")
          styles = { ...styles, minWidth: "0" };
        else if (props.stencil === "15|85" && props.columnIndex === 0)
          styles = { ...styles, maxWidth: "15%" };
        else if (props.stencil === "85|15" && props.columnIndex === 1)
          styles = { ...styles, maxWidth: "15%" };

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
                      background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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

export default function Column(props) {
  const [width, setWidth] = useState("auto");
  return (
    <Droppable
      key={`group-${props.rowIndex}`}
      droppableId={`group-${props.rowIndex}`}
      direction="horizontal"
      type="column"
    >
      {(providedRow, snapshotRow) => {
        let columnMaxWidth = props.edit ? "none" : "120px";

        return (
          <div
            ref={providedRow.innerRef}
            className="group"
            {...providedRow.droppableProps}
          >
            {props.row.map((column, columnIndex) => (
              <RealColumn
                key={columnIndex}
                props={{ ...props, column, columnIndex }}
              />
            ))}
            {providedRow.placeholder}
            {props.edit && (
              <Droppable
                key={`addColumn-${props.rowIndex}`}
                droppableId={`addColumn-${props.rowIndex}`}
                direction="vertical"
                type="field"
              >
                {(provided, snapshot) => {
                  let styles = snapshot.isDraggingOver
                    ? {
                        background: `linear-gradient(-45deg, ${props.themeStyles.bgSvetlejsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgSvetlejsia} 50%, ${props.themeStyles.bgSvetlejsia} 75%, transparent 75%, transparent)`,
                        backgroundSize: "20px 20px",
                      }
                    : {};
                  return (
                    <div
                      ref={provided.innerRef}
                      className="plusCol"
                      style={{
                        ...styles,
                        maxWidth: columnMaxWidth,
                      }}
                      {...provided.droppableProps}
                    >
                      +
                    </div>
                  );
                }}
              </Droppable>
            )}
          </div>
        );
      }}
    </Droppable>
  );
}
