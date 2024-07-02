import { Droppable } from "react-beautiful-dnd";
import Sidebar from "../Sidebar/Sidebar";
import "./BuildArea.css";
import Row from "./Row/Row";
import LineBtn from "./customComponents/addButtons/LineBtn";

export default function BuildArea(props) {
  return (
    <Droppable
      key={`base`}
      droppableId={`base`}
      direction="vertical"
      type="row"
    >
      {(providedBase) => {
        return (
          <div
            ref={providedBase.innerRef}
            className="right-panel"
            {...providedBase.droppableProps}
          >
            <Sidebar
              orientation="horizontal"
              title="Ďalšie komponenty"
              bgColor="#e2e2e2"
              nextBgColor="#fff"
              edit={props.edit}
            >
              <LineBtn setBuildArea={props.setBuildArea} />
            </Sidebar>

            {props.buildArea.map((row, rowIndex) => (
              <Row key={rowIndex} props={{ ...props, row, rowIndex }} />
            ))}
            {providedBase.placeholder}

            {props.edit && (
              <Droppable
                key={`addRow`}
                droppableId={`addRow`}
                direction="vertical"
                type="field"
              >
                {(provided, snapshot) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      className={`plusRow ${
                        snapshot.isDraggingOver ? "draggingOver" : ""
                      }`}
                      {...provided.droppableProps}
                    >
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
