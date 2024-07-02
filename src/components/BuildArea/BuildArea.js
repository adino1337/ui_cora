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
              <LineBtn setBuildArea={props.setBuildArea}/>
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
                  let styles = snapshot.isDraggingOver
                    ? {
                        background: `linear-gradient(-45deg, #e2e2e2 25%, transparent 25%, transparent 50%, #e2e2e2 50%, #e2e2e2 75%, transparent 75%, transparent)`,
                        backgroundSize: "20px 20px",
                      }
                    : {};
                  return (
                    <div
                      ref={provided.innerRef}
                      className="plusRow"
                      {...provided.droppableProps}
                      style={styles}
                    >
                      <Droppable
                        key={`addRowWithColumn`}
                        droppableId={`addRowWithColumn`}
                        direction="vertical"
                        type={"column"}
                      >
                        {(provided, snapshot) => {
                          let styles = snapshot.isDraggingOver
                            ? {
                                background: `linear-gradient(-45deg, #e2e2e2 25%, transparent 25%, transparent 50%, #e2e2e2 50%, #e2e2e2 75%, transparent 75%, transparent)`,
                                backgroundSize: "20px 20px",
                              }
                            : {};
                          return (
                            <div
                              ref={provided.innerRef}
                              className="plusRowWithColumn"
                              {...provided.droppableProps}
                              style={styles}
                            >
                              {props.buildArea.length === 0 ? (
                                <div className="text">
                                  <h2
                                    style={{color: "black",}}
                                  >
                                    UI SCHÉMA
                                  </h2>
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
