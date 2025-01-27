import { Droppable, Draggable } from "react-beautiful-dnd";
import "./Row.css";
import Column from "../Column/Column";
import Line from "../customComponents/Line/Line";
import AddColumnWithField from "../dropzones/AddColumnWithField";

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
          return <Line props={{ ...props, providedField }} />;
        return (
          <div
            ref={providedField.innerRef}
            {...providedField.draggableProps}
            {...providedField.dragHandleProps}
            className={`row ${props.edit ? "editable" : ""}`}
          >
            <Droppable
              key={`group-${props.rowIndex}`}
              droppableId={`group-${props.rowIndex}`}
              direction="horizontal"
              type="column"
            >
              {(providedRow, snapshotRow) => (
                <div
                  ref={providedRow.innerRef}
                  className={`group ${
                    snapshotRow.isDraggingOver ? "dragging" : ""
                  }`}
                  {...providedRow.droppableProps}
                >
                  {props.row.map((column, columnIndex) => (
                    <Column
                      key={columnIndex}
                      props={{ ...props, column, columnIndex }}
                    />
                  ))}
                  {providedRow.placeholder}
                  {props.edit && <AddColumnWithField rowIndex={props.rowIndex} />}
                </div>
              )}
            </Droppable>
          </div>
        );
      }}
    </Draggable>
  );
}
