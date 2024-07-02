import { Droppable } from "react-beautiful-dnd";

export default function AddRowWithColumn(props) {
  return (
    <Droppable
      key={`addRowWithColumn`}
      droppableId={`addRowWithColumn`}
      direction="vertical"
      type={"column"}
    >
      {(provided, snapshot) => {
        return (
          <div
            ref={provided.innerRef}
            className={`plusRowWithColumn ${
              snapshot.isDraggingOver ? "draggingOver" : ""
            }`}
            {...provided.droppableProps}
          >
            {props.buildArea.length === 0 ? (
              <div className="text">
                <h2>UI SCHÉMA</h2>
                <p>pretiahnite a pustite daný blok</p>
                <h4>+</h4>
              </div>
            ) : (
              <div>+</div>
            )}
          </div>
        );
      }}
    </Droppable>
  );
}
