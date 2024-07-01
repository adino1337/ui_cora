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
  dropId,
  sourceList,
  titleList,
  uiBlocks,
  result,
  toTitles
) => {
  const column = get2Delement(dropId, sourceList);
  if (toTitles) {
    if (column[result.source.index].type !== "title") return;
    return moveToList(column, titleList, result);
  }
  if (column[result.source.index].type === "title") return;
  return moveToList(column, uiBlocks, result);
};

export const returnUiBlock = (dropId, sourceList, uiBlocks, result) => {
  return returnFromBuildArea(
    dropId,
    sourceList,
    undefined,
    uiBlocks,
    result,
    false
  );
};

export const returnTitleBlock = (dropId, sourceList, titleBlocks, result) => {
  return returnFromBuildArea(
    dropId,
    sourceList,
    titleBlocks,
    undefined,
    result,
    true
  );
};

export const getElement = (dropId, sourceList) => {
  const index = getRowId(dropId);
  return sourceList[index];
};

export const get2Delement = (dropId, sourceList) => {
  console.log(dropId);
  const rowId = getRowId(dropId);
  const columnId = getColumnId(dropId);
  return sourceList[rowId][columnId];
}
