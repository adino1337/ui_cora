import { useState } from "react";
import { Droppable, Draggable } from "react-beautiful-dnd";

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
              <Draggable
                key={`column-${props.rowIndex}-${columnIndex}-grab`}
                draggableId={`column-${props.rowIndex}-${columnIndex}-grab`}
                index={columnIndex}
                type="column"
                isDragDisabled={!props.edit}
              >
                {(providedField, snapshot) => {
                  let styles = {
                    ...providedField.draggableProps.style,
                  };
                  if (props.edit) styles = { ...styles, maxWidth: "200px" };
                  else if (props.stencil === "50|50")
                    styles = { ...styles, minWidth: "0" };
                  else if (props.stencil === "15|85" && columnIndex === 0)
                    styles = { ...styles, maxWidth: "15%" };
                  else if (props.stencil === "85|15" && columnIndex === 1)
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
                        key={`column-${props.rowIndex}-${columnIndex}`}
                        droppableId={`column-${props.rowIndex}-${columnIndex}`}
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
                              {column.map((field, fieldIndex) => {
                                if (props.row.length === 2) {
                                  if (props.stencil === "15|85")
                                    field.className =
                                      columnIndex === 0
                                        ? "detail-small"
                                        : "detail-large";
                                  else if (props.stencil === "85|15")
                                    field.className =
                                      columnIndex === 0
                                        ? "detail-large"
                                        : "detail-small";
                                  else if (props.stencil === "50|50")
                                    field.className = null;
                                }
                                let styles =
                                  field.type === "title"
                                    ? {
                                        border: "2px solid #101010",
                                      }
                                    : {};
                                return (
                                  <Draggable
                                    key={field.field}
                                    draggableId={field.field}
                                    index={fieldIndex}
                                    type="field"
                                    isDragDisabled={!props.edit}
                                  >
                                    {(providedField, snapshot) => (
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
                                              field.type === "title"
                                                ? props.deleteField(
                                                    props.rowIndex,
                                                    columnIndex,
                                                    fieldIndex,
                                                    "title"
                                                  )
                                                : props.deleteField(
                                                    props.rowIndex,
                                                    columnIndex,
                                                    fieldIndex,
                                                    "UIBlock"
                                                  );
                                            }}
                                          >
                                            X
                                          </div>
                                        )}
                                        <div>{field.title}</div>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              })}
                              {providedCol.placeholder}
                            </div>
                          );
                        }}
                      </Droppable>
                    </div>
                  );
                }}
              </Draggable>
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
