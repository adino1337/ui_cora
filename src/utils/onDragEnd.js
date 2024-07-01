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

const moveWithinArea = (result, buildArea, uiBlocks, titleBlocks) => {
  const sourceList = result.source.droppableId;
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
}

const moveToBuildArea = (result, setBuildArea, uiBlocks, titleBlocks) => {
  const sourceList = result.source.droppableId;
  const destinationList = result.destination.droppableId;
  const blocks = isUIblockList(sourceList) ? uiBlocks : titleBlocks;
  const [movedField] = blocks.splice(result.source.index, 1);

  if (shouldCreateColumn(destinationList))
    return createColumn(movedField, setBuildArea, destinationList);

  return addToColumn(movedField, setBuildArea, destinationList, result);
}

const moveColumn = (result, buildArea) => {
  const sourceList = result.source.droppableId;
  const destinationList = result.destination.droppableId;
  const sourceRowId = getRowId(sourceList);
  const destinationRowId = getRowId(destinationList);
  const sourceRow = buildArea[sourceRowId];
  return moveToList(sourceRow, buildArea[destinationRowId], result);
}

const addRow = (result, buildArea, setBuildArea, isColumn) => {
  const sourceList = result.source.droppableId;
  const rowId = getRowId(sourceList);
  let block = buildArea[rowId];

  if (!isColumn) {
    const columnId = getColumnId(sourceList);
    block = buildArea[rowId][columnId];
  }
  const [deletedBlock] = block.splice(result.source.index, 1);
  return setBuildArea((prev) => [...prev, isColumn ? [deletedBlock] : [[deletedBlock]]]);
}

const editBuildArea = (result, buildArea, setBuildArea, uiBlocks, titleBlocks) => {
  const sourceList = result.source.droppableId;
  const destinationList = result.destination.droppableId;
  // Moved from UI block list or title list
  if (isUIblockList(sourceList) || isTitleList(sourceList)) {
    moveToBuildArea(result, setBuildArea, uiBlocks, titleBlocks);
  }
  // Moving column within build area
  if (isColumn(sourceList) && isColumn(destinationList)) {
    moveColumn(result, buildArea);
  }
  // Create a new row from moving column from another row
  if (isColumn(sourceList) && shouldCreateRowWithColumn(destinationList)) {
    console.log("create row from column");
    addRow(result, buildArea, setBuildArea, true);
  }
  // Making new row from field in buildArea
  if (isField(sourceList) && destinationList === "addRow") {
    addRow(result, buildArea, setBuildArea, false);
  }
  // Moving field inside of build area
  if (isField(sourceList)) {
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
      //// Moved from UI block list or title list
      //if (isUIblockList(sourceList) || isTitleList(sourceList)) {
      //  const blocks = isUIblockList(sourceList) ? uiBlocks : titleBlocks;
      //  const [movedField] = blocks.splice(result.source.index, 1);
      //  if (shouldCreateColumn(destinationList)) {
      //    return createColumn(movedField, setBuildArea, destinationList);
      //  }
      //  return addToColumn(movedField, setBuildArea, destinationList, result);
      //}
      //// Moving column within build area
      //if (isColumn(sourceList) && isColumn(destinationList)) {
      //  const sourceRowId = getRowId(sourceList);
      //  const destinationRowId = getRowId(destinationList);
      //  const sourceRow = buildArea[sourceRowId];
      //  return moveToList(sourceRow, buildArea[destinationRowId], result);
      //}
      //// Create a new row from moving column from another row
      //if (isColumn(sourceList) && shouldCreateRowWithColumn(destinationList)) {
      //  const sourceRowId = getRowId(sourceList);
      //  const sourceRow = buildArea[sourceRowId];
      //  const [deletedColumn] = sourceRow.splice(result.source.index, 1);
      //  return setBuildArea((prev) => [...prev, [deletedColumn]]);
      //}
      //// Making new row from field in buildArea
      //if (isField(sourceList) && destinationList === "addRow") {
      //  const rowId = getRowId(sourceList);
      //  const columnId = getColumnId(sourceList);
      //  const column = buildArea[rowId][columnId];
      //  const [movedField] = column.splice(result.source.index, 1);
      //  return setBuildArea((prev) => [...prev, [[movedField]]]);
      //}
      //// Moving field inside of build area
      //if (isField(sourceList)) {
      //  const sourceRowId = getRowId(sourceList);
      //  const sourceColumnId = getColumnId(sourceList);
      //  const column = buildArea[sourceRowId][sourceColumnId];
      //  const [deletedField] = column.splice(result.source.index, 1);
      //  // Create new column from field inside build area
      //  if (shouldCreateColumn(destinationList)) {
      //    return createColumn(deletedField, setBuildArea, destinationList);
      //  }
      //  // Move field to a column inside build area
      //  return addToColumn(deletedField, setBuildArea, destinationList, result);
      //}
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