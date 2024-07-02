import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import schema from "./schemas/schema_3.json";
import Sidebar from "./components/Sidebar/Sidebar";
import getThemeStyles from "./assets/themes";
import Marks from "./components/Marks/Marks";
import UiBlockPanel from "./components/UiBlockPanel/UiBlockPanel";
import TitleForm from "./components/TitlePanel/TitleForm/TitleForm";
import TitlePanel from "./components/TitlePanel/TitlePanel";
import BuildArea from "./components/BuildArea/BuildArea";
import EditButtons from "./components/EditButtons/EditButtons";
import { ThemeButtons } from "./assets/themes";
import { onDragEnd } from "./utils/onDragEnd";

function App() {
  const [uiBlocks, setUiBlocks] = useState(schema);
  const [titleBlocks, setTitleBlocks] = useState([]);
  const [buildArea, setBuildArea] = useState([]);
  const [edit, setEdit] = useState(true);
  const [dragEnd, setDragEnd] = useState(false);

  useEffect(() => {
    setBuildArea((prev) => {
      return prev
        .map((row) => row.filter((col) => col.length !== 0)) // Filter out empty columns
        .filter((row) => row.length !== 0); // Filter out empty rows
    });
  }, [dragEnd]);

  const handleOnDragEnd = (result) => {
    onDragEnd(
      result,
      buildArea,
      setBuildArea,
      setDragEnd,
      uiBlocks,
      titleBlocks
    );
  };

  const deleteField = (rowIndex, columnIndex, fieldIndex, fieldType) => {
    const movedField = buildArea[rowIndex][columnIndex][fieldIndex];
    setBuildArea((prev) => {
      prev[rowIndex][columnIndex] = prev[rowIndex][columnIndex].filter(
        (_, fieldID) => fieldID !== fieldIndex
      );
      prev[rowIndex] = prev[rowIndex].filter((arr) => arr.length !== 0);
      return prev;
    });
    if (fieldType === "title") setTitleBlocks((prev) => [movedField, ...prev]);
    else setUiBlocks((prev) => [movedField, ...prev]);
    setDragEnd((prev) => !prev); // for check if row or column is not empty to be deleted
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
    let fieldData = buildArea.map((group) =>
      group.map((row) =>
        row.map((col) => {
          if (col.type === "title") {
            let TitleText = col.title.split(" ");
            TitleText.shift();
            let text = TitleText.join(" ");
            if (col.className === null)
              return {
                title: text,
              };
            else
              return {
                title: text,
                className: col.className,
              };
          } else if (col.type === "line")
            return {
              customComponent: "Line",
            };
          else {
            if (col.className === null)
              return {
                field: col.field,
              };
            else
              return {
                field: col.field,
                className: col.className,
              };
          }
        })
      )
    );
    /*
    fieldData = fieldData.map((mark, i) => {
      return [{ markName: markNames[i] }, ...mark];
    });*/

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
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
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
            <Marks edit={edit}/>
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
            <UiBlockPanel edit={edit} uiBlocks={uiBlocks} />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="Nadpisy"
            bgColor={themeStyles.bgTmavsia}
            nextBgColor={themeStyles.bgTmavsia}
            theme={theme}
          >
            <TitleForm setTitleBlocks={setTitleBlocks} theme={theme} />
            <TitlePanel
              edit={edit}
              titleBlocks={titleBlocks}
              setTitleBlocks={setTitleBlocks}
            />
          </Sidebar>

          <div className="right-panel-wrapper">
            <EditButtons
              theme={theme}
              generate={generate}
              setEdit={setEdit}
              edit={edit}
            />
            <BuildArea
              themeStyles={themeStyles}
              edit={edit}
              theme={theme}
              buildArea={buildArea}
              deleteField={deleteField}
              setBuildArea={setBuildArea}
            />
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default App;
