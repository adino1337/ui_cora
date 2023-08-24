import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "./App.css";
import schema from "./schemas/schema_3.json";
import Sidebar from "./components/Sidebar";
function App() {
  const initialFields = schema;

  const [leftFields, setLeftFields] = useState(initialFields);
  const [titleField, setTitleField] = useState([]);
  const [marks, setMarks] = useState([[]]);
  const [activeMark, setActiveMark] = useState(0);
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
  const [edit, setEdit] = useState(true);
  const [type, setType] = useState("field");
  const [titleText, setTitleText] = useState("");
  useEffect(() => {
    console.log("udpate");
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups;
    setMarks(updatedMarks);
  }, [rightFieldGroups]);

  const [dragEnd, setDragEnd] = useState(false);

  useEffect(() => {
    setRightFieldGroups((prev) => {
      return prev.map((row) => {
        return row.filter((col) => col.length !== 0);
      });
    });
    setRightFieldGroups((prev) => {
      return prev.filter((row) => row.length !== 0);
    });
  }, [dragEnd]);

  const onDragEnd = (result) => {
    setDragEnd((prev) => !prev);
    if (!result.destination) return;

    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
    console.log(sourceList, destinationList);
    if (sourceList === "left-list" && destinationList === "addRow") {
      const [movedField] = leftFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    } else if (
      sourceList.split("-")[0] === "column" &&
      destinationList === "addRow"
    ) {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      const [movedField] = sourceFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    }

    if (sourceList === destinationList) {
      if (sourceList.split("-")[0] === "column") {
        let rowNumber = sourceList.split("-")[1];
        let columnNumber = sourceList.split("-")[2];
        console.log(`Presun vo column ${rowNumber} ${columnNumber}`);
        const sourceFields = rightFieldGroups[rowNumber][columnNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setRightFieldGroups((prev) => {
          return prev.map((row, rowIndex) => {
            if (rowIndex === rowNumber) {
              return row.map((column, columnIndex) => {
                if (columnIndex === columnNumber) return sourceFields;
                else return column;
              });
            } else {
              return row;
            }
          });
        });
      } else if (sourceList === "left-list") {
        const sourceFields = leftFields;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setLeftFields([...sourceFields]);
      } else if (sourceList.split("-")[0] === "group") {
        let rowNumber = sourceList.split("-")[1];
        console.log(`Presun medzi column`);
        const sourceFields = rightFieldGroups[rowNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      } else if (sourceList === "base") {
        const sourceFields = rightFieldGroups;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      }
    } else if (destinationList !== "left-list") {
      // Presun z ľavého zoznamu do pravého
      if (sourceList === "left-list") {
        const [movedField] = leftFields.splice(result.source.index, 1);
        if (destinationList.split("-")[0] === "addColumn") {
          let rowNumber = parseInt(destinationList.split("-")[1]);
          //pridá array do arraya podľa groupnumber v rightFieldGroups
          setRightFieldGroups((prev) => {
            return prev.map((row, i) => {
              if (i === rowNumber) return [...row, [movedField]];
              else return row;
            });
          });
        } else if (destinationList.split("-")[0] === "column") {
          const rowNumber = parseInt(destinationList.split("-")[1]);
          const columnNumber = parseInt(destinationList.split("-")[2]);
          let destinationIndex = parseInt(result.destination.index);

          setRightFieldGroups((prev) => {
            return prev.map((row, rowIndex) => {
              if (rowIndex === rowNumber) {
                return row.map((column, columnIndex) => {
                  if (columnIndex === columnNumber) {
                    let updatedColumn = [...column];
                    updatedColumn.splice(destinationIndex, 0, movedField);
                    return updatedColumn;
                  } else return column;
                });
              } else {
                return row;
              }
            });
          });
        }
      } else {
        if (
          sourceList.split("-")[0] === "group" &&
          destinationList.split("-")[0] === "group"
        ) {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          let destinationRowNumber = parseInt(destinationList.split("-")[1]);

          const sourceFields = rightFieldGroups[sourceRowNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          rightFieldGroups[destinationRowNumber].splice(
            result.destination.index,
            0,
            movedField
          );
        } else if (destinationList === "addRowWithColumn") {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          const sourceFields = rightFieldGroups[sourceRowNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          setRightFieldGroups((prev) => [...prev, [movedField]]);
          return;
        } else {
          let sourceRowNumber = parseInt(sourceList.split("-")[1]);
          let sourceColumnNumber = parseInt(sourceList.split("-")[2]);
          const sourceFields =
            rightFieldGroups[sourceRowNumber][sourceColumnNumber];
          const [movedField] = sourceFields.splice(result.source.index, 1);
          if (destinationList.split("-")[0] === "addColumn") {
            let destinationRowNumber = parseInt(destinationList.split("-")[1]);
            setRightFieldGroups((prev) => {
              return prev.map((row, i) => {
                if (i === destinationRowNumber) return [...row, [movedField]];
                else return row;
              });
            });
          } else if (destinationList.split("-")[0] === "column") {
            let destinationRowNumber = parseInt(destinationList.split("-")[1]);
            let destinationColNumber = parseInt(destinationList.split("-")[2]);
            let destinationIndex = parseInt(result.destination.index);
            setRightFieldGroups((prev) => {
              return prev.map((row, rowIndex) => {
                if (rowIndex === destinationRowNumber) {
                  return row.map((column, columnIndex) => {
                    if (columnIndex === destinationColNumber) {
                      let updatedColumn = [...column];
                      updatedColumn.splice(destinationIndex, 0, movedField);
                      return updatedColumn;
                    } else return column;
                  });
                } else {
                  return row;
                }
              });
            });
          }
        }
      }
    } else if (sourceList !== "left-list" && destinationList === "left-list") {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      const [movedField] = sourceFields.splice(result.source.index, 1);
      leftFields.splice(result.destination.index, 0, movedField);
    }
  };

  const deleteMark = (index) => {
    if (marks.length !== 1) {
      const updatedMarks = [...marks];
      updatedMarks.splice(index, 1);
      setMarks(updatedMarks);
      console.log(index);
      if (index === activeMark) {
        setActiveMark(0);
      }
    }
  };

  const changeMark = (index) => {
    /*
    console.log("Start\nMarks")
    console.log(marks)
    console.log("right field groups")
    console.log(rightFieldGroups)*/

    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups;
    setMarks(updatedMarks);

    setActiveMark(index);
    setRightFieldGroups(marks[index]);

    /*
    console.log("End\nMarks")
    console.log(marks)
    console.log("right field groups")
    console.log(rightFieldGroups)*/
  };

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      changeMark(marks.length - 1);
      setButtonClicked(false);
    }
  }, [buttonClicked, marks]);

  const generate = () => {
    const fieldData = marks.map((mark) =>
      mark.map((group) =>
        group.map((row) =>
          row.map((col) => {
            if (col.type === "title")
              return {
                title: col.title,
              };
            else if (col.type === "line")
              return {
                customComponent: "Line",
              };
            else
              return {
                field: col.field,
              };
          })
        )
      )
    );

    const jsonData = JSON.stringify(fieldData, null, 2);
    // Vytvořte Blob objekt z JSON dat
    const blob = new Blob([jsonData], { type: "application/json" });

    // Vytvořte URL objekt pro Blob
    const url = URL.createObjectURL(blob);

    // Vytvořte odkaz pro stažení souboru
    const a = document.createElement("a");
    a.href = url;
    a.download = "fields.json";
    a.click();

    // Uvolnění URL objektu
    URL.revokeObjectURL(url);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="app">
        <Sidebar edit={true} title="Záložky" bgColor="#eaebef" nextBgColor={edit ? "whitesmoke" : "#eaebef"}>
          <div className="marks">
            {marks.map((mark, i) => {
              let active = activeMark === i ? "bold" : "normal";
              let border =
                activeMark === i ? "3px solid black" : "1px solid black";
              return (
                <div
                  className="mark"
                  style={{
                    borderBottom: border,
                  }}
                >
                  <h3
                    style={{
                      cursor: "pointer",
                      fontWeight: active,
                      margin: "20px 0 5px 0",
                    }}
                    onClick={() => changeMark(i)}
                  >
                    Záložka {i + 1}
                  </h3>
                  <h3
                    style={{
                      cursor: "pointer",
                      fontWeight: active,
                      margin: "20px 0 5px 0",
                    }}
                    onClick={() => deleteMark(i)}
                  >
                    X
                  </h3>
                </div>
              );
            })}
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                marginTop: "30px",
              }}
            >
              <button
                onClick={() => {
                  setMarks((prevMarks) => [...prevMarks, []]);
                  setButtonClicked(true);
                }}
              >
                Pridať záložku
              </button>
            </div>
          </div>
          <div
            style={{
              textAlign: "center",
            }}
          >
            <button
              onClick={generate}
              style={{
                margin: "0 0 20px 0",
              }}
            >
              GENEROVAŤ
            </button>
            <button
              onClick={() => setEdit((prev) => !prev)}
              style={{
                margin: "0 0 20px 0",
              }}
            >
              Nahliadnuť export
            </button>
          </div>
        </Sidebar>

        <Sidebar edit={edit} title="UI bloky" bgColor="whitesmoke" nextBgColor="#eaebef">
          <Droppable droppableId="left-list" type="field">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="left-panel"
                {...provided.droppableProps}
              >
                {leftFields.map((field, index) => {
                  if (field.type !== "title")
                    return (
                      <Draggable
                        key={field.field}
                        draggableId={field.field}
                        index={index}
                        type="field"
                        isDragDisabled={!edit}
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
        </Sidebar>

        <Sidebar edit={edit} title="Nadpisy" bgColor="#eaebef" nextBgColor="#eaebef">
          <form
            className="titleInputBox"
            onSubmit={(e) => {
              e.preventDefault();
              if (titleText.length) {
                setTitleField((prev) => [
                  {
                    type: "title",
                    title: "Nadpis: " + titleText,
                    field: titleText + "-" + Date.now(),
                  },
                  ...prev,
                ]);
                setTitleText("");
              }
            }}
          >
            <input
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Nadpis"
            />
            <button>Pridať Nadpis</button>
          </form>
          <Droppable droppableId="title-list" type="field">
            {(provided) => (
              <div
                ref={provided.innerRef}
                className="left-panel"
                style={{ marginTop: "10px" }}
                {...provided.droppableProps}
              >
                {titleField.map((field, index) => {
                  return (
                    <Draggable
                      key={field.field}
                      draggableId={field.field}
                      index={index}
                      type="field"
                      isDragDisabled={!edit}
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
        </Sidebar>

        <div className="right-panel-wrapper">
          <div className="text">
            <h4>Vytvorte UI schému</h4>
            <p>
              Vyskladajte si vlastnú schému pomocou UI blokov, vlastných
              nadpisov a ďalších komponentov
            </p>
          </div>
          <Droppable
            key={`base`}
            droppableId={`base`}
            direction="vertical"
            type="row"
          >
            {(providedBase, snapshot) => {
              return (
                <div
                  ref={providedBase.innerRef}
                  className="right-panel"
                  {...providedBase.droppableProps}
                >
                  <Sidebar orientation="horizontal" title="Ďalšie komponenty" bgColor="#eaebef" nextBgColor="whitesmoke" edit={edit}>
                    <button
                      onClick={() => {
                        setRightFieldGroups((prev) => {
                          return [...prev, [[{ type: "line" }]]];
                        });
                      }}
                    >
                      Čiara
                    </button>
                  </Sidebar>
                  
                  {rightFieldGroups.map((row, rowIndex) => (
                    <Draggable
                      key={`row-${rowIndex}-grab`}
                      draggableId={`row-${rowIndex}-grab`}
                      index={rowIndex}
                      type="row"
                      isDragDisabled={!edit}
                    >
                      {(providedField, snapshot) => {
                        let typeOfComponent;
                        try {
                          typeOfComponent = row[0][0].type;

                          if (typeOfComponent === "line")
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
                              }}
                              className="row"
                            >
                              <Droppable
                                key={`group-${rowIndex}`}
                                droppableId={`group-${rowIndex}`}
                                direction="horizontal"
                                type="column"
                              >
                                {(providedRow, snapshotRow) => {
                                  let columnMaxWidth = edit ? "none" : "120px";

                                  return (
                                    <div
                                      ref={providedRow.innerRef}
                                      className="group"
                                      {...providedRow.droppableProps}
                                    >
                                      {row.map((column, columnIndex) => (
                                        <Draggable
                                          key={`column-${rowIndex}-${columnIndex}-grab`}
                                          draggableId={`column-${rowIndex}-${columnIndex}-grab`}
                                          index={columnIndex}
                                          type="column"
                                          isDragDisabled={!edit}
                                        >
                                          {(providedField, snapshot) => {
                                            let styles = {
                                              ...providedField.draggableProps
                                                .style,
                                            };
                                            styles = edit
                                              ? {
                                                  ...styles,
                                                  maxWidth: "200px",
                                                }
                                              : {
                                                  ...styles,
                                                  minWidth: "0",
                                                };

                                            return (
                                              <div
                                                ref={providedField.innerRef}
                                                {...providedField.draggableProps}
                                                {...providedField.dragHandleProps}
                                                style={styles}
                                                className="column"
                                              >
                                                <Droppable
                                                  key={`column-${rowIndex}-${columnIndex}`}
                                                  droppableId={`column-${rowIndex}-${columnIndex}`}
                                                  direction="vertical"
                                                  type="field"
                                                >
                                                  {(providedCol, snapshot) => {
                                                    return (
                                                      <div
                                                        ref={
                                                          providedCol.innerRef
                                                        }
                                                        className="column-droppable"
                                                        {...providedCol.droppableProps}
                                                      >
                                                        {column.map(
                                                          (
                                                            field,
                                                            fieldIndex
                                                          ) => (
                                                            <Draggable
                                                              key={field.field}
                                                              draggableId={
                                                                field.field
                                                              }
                                                              index={fieldIndex}
                                                              type="field"
                                                              isDragDisabled={
                                                                !edit
                                                              }
                                                            >
                                                              {(
                                                                providedField,
                                                                snapshot
                                                              ) => (
                                                                <div
                                                                  className="field"
                                                                  ref={
                                                                    providedField.innerRef
                                                                  }
                                                                  {...providedField.draggableProps}
                                                                  {...providedField.dragHandleProps}
                                                                  style={{
                                                                    ...providedField
                                                                      .draggableProps
                                                                      .style,
                                                                  }}
                                                                >
                                                                  {field.title}
                                                                </div>
                                                              )}
                                                            </Draggable>
                                                          )
                                                        )}
                                                        {
                                                          providedCol.placeholder
                                                        }
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
                                      {edit && (
                                        <Droppable
                                          key={`addColumn-${rowIndex}`}
                                          droppableId={`addColumn-${rowIndex}`}
                                          direction="vertical"
                                          type="field"
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              className="plusCol"
                                              style={{
                                                maxWidth: columnMaxWidth,
                                              }}
                                              {...provided.droppableProps}
                                            >
                                              +
                                            </div>
                                          )}
                                        </Droppable>
                                      )}
                                    </div>
                                  );
                                }}
                              </Droppable>
                            </div>
                          );
                        } catch (e) {
                          console.error("ERROR: " + e);
                        }
                      }}
                    </Draggable>
                  ))}
                  {providedBase.placeholder}

                  {edit && (
                    <Droppable
                      key={`addRow`}
                      droppableId={`addRow`}
                      direction="vertical"
                      type={type}
                    >
                      {(provided, snapshotUpper) => {
                        return (
                          <div
                            ref={provided.innerRef}
                            className="plusRow"
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
                                    className="plusRowWithColumn"
                                    {...provided.droppableProps}
                                  >
                                    {rightFieldGroups.length === 0 ? (
                                      <div className="text">
                                        <h2>UI Schéma</h2>
                                        <h4>Pretiahnite a pustite daný blok</h4>
                                        <h4>+</h4>
                                      </div>
                                    ) : (
                                      <div style={{ color: "#101010" }}>+</div>
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
        </div>
      </div>
    </DragDropContext>
  );
}

export default App;
