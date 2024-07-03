import { useState, useEffect } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import "./UIGenerator.css";
import Sidebar from "../components/Sidebar/Sidebar";
import Marks from "../components/Marks/Marks";
import UiBlockPanel from "../components/UiBlockPanel/UiBlockPanel";
import TitleForm from "../components/TitlePanel/TitleForm/TitleForm";
import TitlePanel from "../components/TitlePanel/TitlePanel";
import BuildArea from "../components/BuildArea/BuildArea";
import EditButtons from "../components/EditButtons/EditButtons";
import { onDragEnd } from "../utils/onDragEnd";
import buildAreaToSchemaMapper from "../utils/buildAreaToSchemaMapper";
import customComponentsTypes from "../components/BuildArea/customComponents/customComponentsConfig";

export default function UIGenerator({ schema }) {
  const [uiBlocks, setUiBlocks] = useState(schema);
  const [titleBlocks, setTitleBlocks] = useState([]);
  const [edit, setEdit] = useState(true);
  const [dragEnd, setDragEnd] = useState(false);
  const [activeMark, setActiveMark] = useState(0);
  const [marks, setMarks] = useState([[]]);
  const [buildArea, setBuildArea] = useState(marks[activeMark]);

  // Update buildArea when activeMark changes
  useEffect(() => {
    setBuildArea(marks[activeMark]);
  }, [activeMark]);

  // Update marks when buildArea changes
  useEffect(() => {
    setMarks((prevMarks) => {
      const newMarks = [...prevMarks];
      newMarks[activeMark] = buildArea;
      return newMarks;
    });
  }, [buildArea]);

  // Filter out empty rows and columns when drag ends
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

  const deleteField = (
    rowIndex,
    columnIndex,
    fieldIndex,
    fieldType,
    mark = activeMark
  ) => {
    if (customComponentsTypes.includes(fieldType)) return;
    const deletedField = marks[mark][rowIndex][columnIndex][fieldIndex];
    if (mark === activeMark) {
      setBuildArea((prev) => {
        prev[rowIndex][columnIndex] = prev[rowIndex][columnIndex].filter(
          (_, fieldID) => fieldID !== fieldIndex
        );
        return [...prev];
      });
    }
    if (fieldType === "title")
      setTitleBlocks((prev) => [deletedField, ...prev]);
    else setUiBlocks((prev) => [deletedField, ...prev]);
    setDragEnd((prev) => !prev); // check if row or column is not empty to be deleted
  };

  const addMark = () => {
    setMarks((prev) => [...prev, []]);
    setActiveMark(marks.length); // Set the new mark as active
  };

  const deleteMark = (index) => {
    const markToBeDeleted = marks[index];
    markToBeDeleted.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        col.forEach((field, fieldIndex) => {
          deleteField(rowIndex, colIndex, fieldIndex, field.type, index);
        });
      });
    });
    setMarks((prevMarks) => prevMarks.filter((_, i) => i !== index));
    if (index === activeMark) {
      setActiveMark(Math.max(0, index - 1));
    } else if (index < activeMark) {
      setActiveMark((prev) => prev - 1);
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="UIGenerator">
          <Sidebar
            edit={true}
            title="Záložky"
            even={false}
          >
            <Marks
              edit={edit}
              marks={marks}
              activeMark={activeMark}
              addMark={addMark}
              switchMark={(index) => setActiveMark(index)}
              deleteMark={deleteMark}
            />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="UI bloky"
            even={true}
          >
            <UiBlockPanel edit={edit} uiBlocks={uiBlocks} />
          </Sidebar>

          <Sidebar
            edit={edit}
            title="Nadpisy"
            even={false}
          >
            <TitleForm setTitleBlocks={setTitleBlocks} />
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
