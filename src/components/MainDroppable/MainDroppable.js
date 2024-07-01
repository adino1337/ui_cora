import { Droppable, Draggable } from "react-beautiful-dnd";
import Sidebar from "../Sidebar/Sidebar";
import "./MainDroppable.css";
import Column from "./Column";
import SettingsBox from "./SettingsBox";
import { useState } from "react";

function Row(props) {
  const [stencil, setStencil] = useState("50|50");
  return (
    <>
      {props.row.length === 2 && !props.edit && (
        <SettingsBox
          theme={props.theme}
          themeStyles={props.themeStyles}
          setStencil={setStencil}
          stencil={stencil}
          rowIndex={props.rowIndex}
        />
      )}
      <Column
        row={props.row}
        rowIndex={props.rowIndex}
        themeStyles={props.themeStyles}
        edit={props.edit}
        theme={props.theme}
        deleteField={props.deleteField}
        stencil={stencil}
      />
    </>
  );
}

export default function MainDroppable(props) {
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
              bgColor={props.themeStyles.bgTmavsia}
              nextBgColor={props.themeStyles.bgSvetlejsia}
              edit={props.edit}
              theme={props.theme}
            >
              <button
                onClick={() => {
                  props.setBuildArea((prev) => {
                    return [...prev, [[{ type: "line" }]]];
                  });
                }}
              >
                Čiara
              </button>
            </Sidebar>

            {props.buildArea.map((row, rowIndex) => (
              <Draggable
                key={`row-${rowIndex}-grab`}
                draggableId={`row-${rowIndex}-grab`}
                index={rowIndex}
                type="row"
                isDragDisabled={!props.edit}
              >
                {(providedField) => {
                  console.log(row);
                  if (row[0] && row[0][0].type === "line")
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
                              prev.filter((row, rowID) => rowID !== rowIndex)
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
                      <Row
                        row={row}
                        rowIndex={rowIndex}
                        themeStyles={props.themeStyles}
                        edit={props.edit}
                        theme={props.theme}
                        deleteField={props.deleteField}
                      />
                    </div>
                  );
                }}
              </Draggable>
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
                        background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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
                                background: `linear-gradient(-45deg, ${props.themeStyles.bgTmavsia} 25%, transparent 25%, transparent 50%, ${props.themeStyles.bgTmavsia} 50%, ${props.themeStyles.bgTmavsia} 75%, transparent 75%, transparent)`,
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
                                    style={{
                                      color: props.theme === "light" && "black",
                                    }}
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
