export const isField = (dropId) => dropId.split("-")[0] === "column";
export const isColumn = (dropId) => dropId.split("-")[0] === "group";
export const isRow = (dropId) => dropId.split("-")[0] === "base";
export const isUIblockList = (dropId) => dropId === "uiBlocks-list";
export const isTitleList = (dropId) => dropId === "title-list";

export const getColumnId = (dropId) => parseInt(dropId.split("-")[2]);
export const getRowId = (dropId) => parseInt(dropId.split("-")[1]);

export const shouldCreateColumn = (dropId) =>
  dropId.split("-")[0] === "addColumn";

export const shouldCreateRowWithColumn = (dropId) =>
  dropId === "addRowWithColumn";

export const updateList = (list, dragResult) => {
  const [deletedField] = list.splice(dragResult.source.index, 1);
  list.splice(dragResult.destination.index, 0, deletedField);
};

export const moveToList = (sourceList, destinationList, dragResult) => {
  const [deletedField] = sourceList.splice(dragResult.source.index, 1);
  destinationList.splice(dragResult.destination.index, 0, deletedField);
};

export const createColumn = (movedField, setBuildArea, destinationList) => {
  const rowId = getRowId(destinationList);
  setBuildArea((prev) => {
    return prev.map((row, i) => {
      return i === rowId ? [...row, [movedField]] : row;
    });
  });
};

export const addToColumn = (
  movedField,
  setBuildArea,
  destinationList,
  result
) => {
  const rowId = getRowId(destinationList);
  const columnId = getColumnId(destinationList);
  const destinationIndex = parseInt(result.destination.index);
  setBuildArea((prev) =>
    prev.map((row, rowIndex) => {
      if (rowIndex !== rowId) return row;
      return row.map((column, columnIndex) => {
        if (columnIndex !== columnId) return column;
        let updatedColumn = [...column];
        updatedColumn.splice(destinationIndex, 0, movedField);
        return updatedColumn;
      });
    })
  );
};

export const movedToBuildArea = (destination) =>
  destination !== "uiBlocks-list" && destination !== "title-list";

const returnFromBuildArea = (
  sourceList,
  mainList,
  titleList,
  uiBlocks,
  result,
  toTitles
) => {
  const rowId = getRowId(sourceList);
  const columnId = getColumnId(sourceList);
  const column = mainList[rowId][columnId];
  if (toTitles) {
    if (column[result.source.index].type !== "title") return;
    return moveToList(column, titleList, result);
  }
  if (column[result.source.index].type === "title") return;
  return moveToList(column, uiBlocks, result);
};

export const returnUiBlock = (sourceList, mainList, uiBlocks, result) => {
  return returnFromBuildArea(
    sourceList,
    mainList,
    undefined,
    uiBlocks,
    result,
    false
  );
};

export const returnTitleBlock = (sourceList, mainList, titleBlocks, result) => {
  return returnFromBuildArea(
    sourceList,
    mainList,
    titleBlocks,
    undefined,
    result,
    true
  );
};
