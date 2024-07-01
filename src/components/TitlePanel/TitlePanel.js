import {Droppable, Draggable } from "react-beautiful-dnd";
import "./TitlePanel.css"
export default function TitlePanel(props){
    
    return(
        <Droppable droppableId="title-list" type="field">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  className="left-panel"
                  style={{ marginTop: "10px" }}
                  {...provided.droppableProps}
                >
                  {props.titleBlocks.map((field, index) => {
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
                              position:"relative",
                              ...provided.draggableProps.style,
                            }}
                          >
                            {field.title}
                            {props.edit && (
                              <div
                                className="delete"
                                onClick={() => props.setTitleBlocks(prev=>prev.filter((field,id)=> id!==index))}
                              >
                                X
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          
    )
}