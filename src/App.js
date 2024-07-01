import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import schema from "./schemas/schema_3.json";
import Sidebar from "./components/Sidebar/Sidebar";
import getThemeStyles from "./assets/themes";
import Marks from "./components/Marks/Marks";
import UiBlockPanel from "./components/UiBlockPanel/UiBlockPanel";
import TitleForm from "./components/TitleForm/TitleForm";
import TitlePanel from "./components/TitlePanel/TitlePanel";
import MainDroppable from "./components/MainDroppable/MainDroppable";
import EditButtons from "./components/EditButtons/EditButtons";
import { ThemeButtons } from "./assets/themes";
function App() {
  const initialFields = schema;

  const [leftFields, setLeftFields] = useState(initialFields);
  const [titleField, setTitleField] = useState([]);
  const [marks, setMarks] = useState([[]]);
  const [markNames, setMarkNames] = useState(["Formulár"]);
  const [activeMark, setActiveMark] = useState(0);
  const [rightFieldGroups, setRightFieldGroups] = useState(marks[activeMark]);
  const [edit, setEdit] = useState(true);
  const [dragEnd, setDragEnd] = useState(false);


  // Delete empty drop areas, after drag ended
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

    if (sourceList === "left-list" && destinationList === "addRow") {
      const [movedField] = leftFields.splice(result.source.index, 1);
      setRightFieldGroups((prev) => [...prev, [[movedField]]]);
      return;
    } else if (sourceList === "title-list" && destinationList === "addRow") {
      const [movedField] = titleField.splice(result.source.index, 1);
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

    if (sourceList === "title-list" && destinationList === "left-list") return;
    if (sourceList === "left-list" && destinationList === "title-list") return;

    if (sourceList === destinationList) {
      if (sourceList.split("-")[0] === "column") {
        let rowNumber = sourceList.split("-")[1];
        let columnNumber = sourceList.split("-")[2];
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
      } else if (sourceList === "title-list") {
        const sourceFields = titleField;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
        setTitleField([...sourceFields]);
      } else if (sourceList.split("-")[0] === "group") {
        let rowNumber = sourceList.split("-")[1];
        const sourceFields = rightFieldGroups[rowNumber];
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      } else if (sourceList === "base") {
        const sourceFields = rightFieldGroups;
        const [movedField] = sourceFields.splice(result.source.index, 1);
        sourceFields.splice(result.destination.index, 0, movedField);
      }
    } else if (
      destinationList !== "left-list" &&
      destinationList !== "title-list"
    ) {
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
      } else if (sourceList === "title-list") {
        const [movedField] = titleField.splice(result.source.index, 1);
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
      if (sourceFields[result.source.index].type === "title") return;
      const [movedField] = sourceFields.splice(result.source.index, 1);
      leftFields.splice(result.destination.index, 0, movedField);
    } else if (
      sourceList !== "title-list" &&
      destinationList === "title-list"
    ) {
      let rowNumber = sourceList.split("-")[1];
      let columnNumber = sourceList.split("-")[2];
      const sourceFields = rightFieldGroups[rowNumber][columnNumber];
      if (sourceFields[result.source.index].type !== "title") return;
      const [movedField] = sourceFields.splice(result.source.index, 1);
      titleField.splice(result.destination.index, 0, movedField);
    }
  };

  const deleteField = (rowIndex, columnIndex, fieldIndex, fieldType) => {
    const movedField = rightFieldGroups[rowIndex][columnIndex][fieldIndex];
    setRightFieldGroups((prev) => {
      prev[rowIndex][columnIndex] = prev[rowIndex][columnIndex].filter(
        (_, fieldID) => fieldID !== fieldIndex
      );
      prev[rowIndex] = prev[rowIndex].filter((arr) => arr.length !== 0);
      return prev;
    });

    if (fieldType === "title") setTitleField((prev) => [movedField, ...prev]);
    else setLeftFields((prev) => [movedField, ...prev]);
  };

  const [theme, setTheme] = useState("");
  const [themeStyles, setThemeStyles] = useState({});

  useEffect(() => {
    if (localStorage.getItem("theme")) setTheme(localStorage.getItem("theme"));
    else setTheme("light");
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    setThemeStyles(getThemeStyles(theme));
  }, [theme]);
  
  function setThemeVariables(themeStyles) {
    const root = document.querySelector(":root");
    for (const [property, value] of Object.entries(themeStyles)) {
      root.style.setProperty(`--${property}`, value);
    }
  }
  
  useEffect(() => {
    setThemeVariables(themeStyles);
  }, [themeStyles]);
  

  const generate = () => {
    let fieldData = marks.map((mark) =>
      mark.map((group) =>
        group.map((row) =>
          row.map((col) => {
            if (col.type === "title") {
              let TitleText = col.title.split(" ");
              TitleText.shift();
              let text = TitleText.join(" ");
              if(col.className === null)
              return {
                title: text,
              }
              else
              return {
                title: text,
                className: col.className
              }
            } else if (col.type === "line")
              return {
                customComponent: "Line",
              };
            else{
              if(col.className === null)
              return {
                field: col.field,
              }
              else
              return {
                field: col.field,
                className: col.className
              }
            }
          })
        )
      )
    );

    fieldData = fieldData.map((mark, i) => {
      return [{ markName: markNames[i] }, ...mark];
    });

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

  useEffect(() => {
    const updatedMarks = [...marks];
    updatedMarks[activeMark] = rightFieldGroups;
    setMarks(updatedMarks);
  }, [rightFieldGroups]);

  const deleteMark = (index) => {
    if (marks[index] && marks[index][0]) {
      marks[index].forEach((row) => {
        row.forEach((col) => {
          col.forEach((field) => {
            if (field.type && field.type === "title")
              setTitleField((prev) => [field, ...prev]);
            else if (field.type && field.type === "line") return;
            else setLeftFields((prev) => [field, ...prev]);
          });
        });
      });
    }

    setMarkNames((prev) => prev.filter((name, id) => id !== index));
    setMarks((prev) => {
      if (index === activeMark) {
        setActiveMark(0);
        setRightFieldGroups(marks[0]);
      } else if (index < activeMark) {
        setRightFieldGroups(marks[activeMark]);
        setActiveMark((prev) => prev - 1);
      }
      return prev.filter((mark, markID) => markID !== index);
    });
  };

  const changeMark = (index) => {
    setActiveMark(index);
    setRightFieldGroups(marks[index]);
  };

  const [buttonClicked, setButtonClicked] = useState(false);

  useEffect(() => {
    if (buttonClicked) {
      changeMark(marks.length - 1);
      setButtonClicked(false);
    }
  }, [buttonClicked, marks]);

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="app">
          <Sidebar
            edit={true}
            title="Záložky"
            bgColor={themeStyles.bgTmavsia}
            nextBgColor={
              edit ? themeStyles.bgSvetlejsia : themeStyles.bgTmavsia
            }
            theme={theme}
          >
            <Marks
              activeMark={activeMark}
              themeStyles={themeStyles}
              theme={theme}
              edit={edit}
              markNames={markNames}
              changeMark={changeMark}
              deleteMark={deleteMark}
              setMarkNames={setMarkNames}
              setMarks={setMarks}
              marks={marks}
              setButtonClicked={setButtonClicked}
            />
            <ThemeButtons
              setTheme={setTheme}
              theme={theme}
              themeStyles={themeStyles}
            />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="UI bloky"
            bgColor={themeStyles.bgSvetlejsia}
            nextBgColor={themeStyles.bgTmavsia}
            theme={theme}
          >
            <UiBlockPanel edit={edit} leftFields={leftFields} />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="Nadpisy"
            bgColor={themeStyles.bgTmavsia}
            nextBgColor={themeStyles.bgTmavsia}
            theme={theme}
          >
            <TitleForm setTitleField={setTitleField} theme={theme} />
            <TitlePanel
              edit={edit}
              titleField={titleField}
              setTitleField={setTitleField}
            />
          </Sidebar>

          <div className="right-panel-wrapper">
            <EditButtons
              theme={theme}
              generate={generate}
              setEdit={setEdit}
              edit={edit}
              markName={markNames[activeMark]}
            />
            <MainDroppable
              themeStyles={themeStyles}
              edit={edit}
              theme={theme}
              rightFieldGroups={rightFieldGroups}
              deleteField={deleteField}
              setRightFieldGroups={setRightFieldGroups}
            />
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
