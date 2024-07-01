import {
  shouldCreateColumn,
  getColumnId,
  getRowId,
  isColumn,
  isField,
  isRow,
  movedToBuildArea,
  updateList,
  createColumn,
  addToColumn,
  isUIblockList,
  isTitleList,
  moveToList,
  shouldCreateRowWithColumn,
  returnUiBlock,
} from "./utils";

const addNewRow = (result, blocks, setBuildArea) => {
  const [movedField] = blocks.splice(result.source.index, 1);
  return setBuildArea((prev) => [...prev, [[movedField]]]);  
}

const moveWithinArea = (result, buildArea, uiBlocks, titleBlocks, sourceList) => {
  const rowId = getRowId(sourceList);
  const columnId = getColumnId(sourceList);
  // Move within UI blocks
  if (sourceList === "uiBlocks-list") {
    return updateList(uiBlocks, result);
  }
  // Move within title list
  if (sourceList === "title-list") {
    return updateList(titleBlocks, result);
  }
  // Move of field within same column
  if (isField(sourceList)) {
    const column = buildArea[rowId][columnId];
    return updateList(column, result);
  }
  // Move of column within same row
  if (isColumn(sourceList)) {
    const row = buildArea[rowId];
    return updateList(row, result);
  }
  // Move of row within build area
  if (isRow(sourceList)) {
    return updateList(buildArea, result);
  }
  return null;
}

const moveToBuildArea = (result, setBuildArea, uiBlocks, titleBlocks, sourceList, destinationList) => {
  const blocks = isUIblockList(sourceList) ? uiBlocks : titleBlocks;
  const [movedField] = blocks.splice(result.source.index, 1);

  if (shouldCreateColumn(destinationList))
    return createColumn(movedField, setBuildArea, destinationList);

  return addToColumn(movedField, setBuildArea, destinationList, result);
}

const moveColumn = (result, buildArea, sourceList, destinationList) => {
  const sourceRowId = getRowId(sourceList);
  const destinationRowId = getRowId(destinationList);
  const sourceRow = buildArea[sourceRowId];
  return moveToList(sourceRow, buildArea[destinationRowId], result);
}

const addRow = (result, buildArea, setBuildArea, isColumn, sourceList) => {
  const rowId = getRowId(sourceList);
  let block = buildArea[rowId];

  if (!isColumn) {
    const columnId = getColumnId(sourceList);
    block = buildArea[rowId][columnId];
  }

  const [deletedBlock] = block.splice(result.source.index, 1);
  return setBuildArea((prev) => [...prev, isColumn ? [deletedBlock] : [[deletedBlock]]]);
}

const moveField = (result, buildArea, setBuildArea, sourceList, destinationList) => {
  const sourceRowId = getRowId(sourceList);
  const sourceColumnId = getColumnId(sourceList);
  const column = buildArea[sourceRowId][sourceColumnId];
  const [deletedField] = column.splice(result.source.index, 1);
  // Create new column from field inside build area
  if (shouldCreateColumn(destinationList)) {
    return createColumn(deletedField, setBuildArea, destinationList);
  }
  // Move field to a column inside build area
  return addToColumn(deletedField, setBuildArea, destinationList, result);
}

const editBuildArea = (result, buildArea, setBuildArea, uiBlocks, titleBlocks) => {
  const sourceList = result.source.droppableId;
  const destinationList = result.destination.droppableId;
  // Moved from UI block list or title list
  if (isUIblockList(sourceList) || isTitleList(sourceList)) {
    return moveToBuildArea(result, setBuildArea, uiBlocks, titleBlocks, sourceList, destinationList);
  }
  // Moving column within build area
  if (isColumn(sourceList) && isColumn(destinationList)) {
    return moveColumn(result, buildArea, sourceList, destinationList);
  }
  // Create a new row from moving column from another row
  if (isColumn(sourceList) && shouldCreateRowWithColumn(destinationList)) {
    return addRow(result, buildArea, setBuildArea, true, sourceList);
  }
  // Making new row from field in buildArea
  if (isField(sourceList) && destinationList === "addRow") {
    return addRow(result, buildArea, setBuildArea, false, sourceList);
  }
  // Moving field inside of build area
  if (isField(sourceList)) {
    return moveField(result, buildArea, setBuildArea, sourceList, destinationList);
  }
}

export const onDragEnd = (result, buildArea, setBuildArea, setDragEnd, uiBlocks, titleBlocks) => {
    setDragEnd((prev) => !prev);
    // Cant move outside of droppable area
    if (!result.destination) return;

    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
    // Cant move ui block to title list
    if (sourceList === "uiBlocks-list" && destinationList === "title-list")
      return;
    // Cant move title to UIblock list
    if (sourceList === "title-list" && destinationList === "uiBlocks-list")
      return;
    // Make new row from UI block
    if (sourceList === "uiBlocks-list" && destinationList === "addRow")
      return addNewRow(result, uiBlocks, setBuildArea);
    // Make new row from title
    if (sourceList === "title-list" && destinationList === "addRow")
      return addNewRow(result, titleBlocks, setBuildArea);
    // Move within the same droppable area
    if (sourceList === destinationList) {
      return moveWithinArea(result, buildArea, uiBlocks, titleBlocks, sourceList);
    }
    if (movedToBuildArea(destinationList)) {
      return editBuildArea(result, buildArea, setBuildArea, uiBlocks, titleBlocks);
    }
    // Return block back to default lists
    // From build area to UIblocks list
    if (sourceList !== "uiBlocks-list" && destinationList === "uiBlocks-list") {
      return returnUiBlock(sourceList, buildArea, uiBlocks, result);
    }
    // From build area to title list
    if (sourceList !== "title-list" && destinationList === "title-list") {
      return returnUiBlock(sourceList, buildArea, titleBlocks, result);
    }
  };