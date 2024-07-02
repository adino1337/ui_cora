import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./App.css";
import schema from "./schemas/schema_3.json";
import Sidebar from "./components/Sidebar/Sidebar";
import Marks from "./components/Marks/Marks";
import UiBlockPanel from "./components/UiBlockPanel/UiBlockPanel";
import TitleForm from "./components/TitlePanel/TitleForm/TitleForm";
import TitlePanel from "./components/TitlePanel/TitlePanel";
import BuildArea from "./components/BuildArea/BuildArea";
import EditButtons from "./components/EditButtons/EditButtons";
import { onDragEnd } from "./utils/onDragEnd";
import buildAreaToSchemaMapper from "./utils/buildAreaToSchemaMapper";
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

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="app">
          <Sidebar
            edit={true}
            title="Záložky"
            bgColor={"#e2e2e2"}
            nextBgColor={
              edit ? "#fff" : "#e2e2e2"
            }
          >
            <Marks edit={edit}/>
          </Sidebar>

          <Sidebar
            edit={edit}
            title="UI bloky"
            bgColor={"#fff"}
            nextBgColor={"#e2e2e2"}
          >
            <UiBlockPanel edit={edit} uiBlocks={uiBlocks} />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="Nadpisy"
            bgColor={"#e2e2e2"}
            nextBgColor={"#e2e2e2"}
          >
            <TitleForm setTitleBlocks={setTitleBlocks}/>
            <TitlePanel
              edit={edit}
              titleBlocks={titleBlocks}
              setTitleBlocks={setTitleBlocks}
            />
          </Sidebar>

          <div className="right-panel-wrapper">
            <EditButtons
              save={() => buildAreaToSchemaMapper(buildArea)}
              setEdit={setEdit}
              edit={edit}
            />
            <BuildArea
              edit={edit}
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
