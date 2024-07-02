import "./Line.css";
export default function Line({ props }) {
  return (
    <div
      ref={props.providedField.innerRef}
      {...props.providedField.draggableProps}
      {...props.providedField.dragHandleProps}
      className={`line-container ${props.edit ? "editable" : ""}`}
      onClick={() => {
        if (props.edit)
          props.setBuildArea((prev) =>
            prev.filter((_, rowID) => rowID !== props.rowIndex)
          );
      }}
    >
      <div className="line"></div>
    </div>
  );
}
