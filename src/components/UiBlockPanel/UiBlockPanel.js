import { Draggable, Droppable } from "react-beautiful-dnd";
import "./UiBlockPanel.css";
export default function UiBlockPanel(props) {
  return (
    <Droppable droppableId="uiBlocks-list" type="field">
      {(provided) => (
        <div
          ref={provided.innerRef}
          className="left-panel"
          {...provided.droppableProps}
        >
          {props.uiBlocks.map((field, index) => {
            if (field.type !== "title")
              return (
                <Draggable
                  key={field.field}
                  draggableId={field.field}
                  index={index}
                  type="field"
                  isDragDisabled={!props.edit}
                >
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="field"
                      style={{
                        ...provided.draggableProps.style,
                      }}
                    >
                      {field.title}
                    </div>
                  )}
                </Draggable>
              );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}
