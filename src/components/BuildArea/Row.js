import { Droppable, Draggable } from "react-beautiful-dnd";
import Column from "./Column";

export default function Row({ props }) {
  return (
    <Draggable
      key={`row-${props.rowIndex}-grab`}
      draggableId={`row-${props.rowIndex}-grab`}
      index={props.rowIndex}
      type="row"
      isDragDisabled={!props.edit}
    >
      {(providedField) => {
        if (props.row[0] && props.row[0][0] && props.row[0][0].type === "line")
          return (
            <div
              ref={providedField.innerRef}
              {...providedField.draggableProps}
              {...providedField.dragHandleProps}
              style={{
                padding: "20px 0",
                display: "flex",
                ...providedField.draggableProps.style,
              }}
              onClick={() => {
                if (props.edit)
                  props.setBuildArea((prev) =>
                    prev.filter((row, rowID) => rowID !== props.rowIndex)
                  );
              }}
            >
              <div className="line"></div>
            </div>
          );
        return (
          <div
            ref={providedField.innerRef}
            {...providedField.draggableProps}
            {...providedField.dragHandleProps}
            style={{
              ...providedField.draggableProps.style,
              padding: !props.edit ? "40px" : "20px",
            }}
            className="row"
          >
            <>
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
                        <Column
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
            </>
          </div>
        );
      }}
    </Draggable>
  );
}
