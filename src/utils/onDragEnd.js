import {
  shouldCreateColumn,
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
  returnTitleBlock,
  getElement,
  get2Delement,
} from "./onDragUtils";

const addNewRow = (result, blocks, setBuildArea) => {
  const [movedField] = blocks.splice(result.source.index, 1);
  return setBuildArea((prev) => [...prev, [[movedField]]]);  
}

const moveWithinArea = (result, buildArea, uiBlocks, titleBlocks, sourceId) => {
  // Move within UI blocks
  if (sourceId === "uiBlocks-list") {
    return updateList(uiBlocks, result);
  }
  // Move within title list
  if (sourceId === "title-list") {
    return updateList(titleBlocks, result);
  }
  // Move of field within same column
  if (isField(sourceId)) {
    const column = get2Delement(sourceId, buildArea);
    return updateList(column, result);
  }
  // Move of column within same row
  if (isColumn(sourceId)) {
    const row = getElement(sourceId, buildArea);
    return updateList(row, result);
  }
  // Move of row within build area
  if (isRow(sourceId)) {
    return updateList(buildArea, result);
  }
  return null;
}

const moveToBuildArea = (result, setBuildArea, uiBlocks, titleBlocks, sourceId, destinationId) => {
  const blocks = isUIblockList(sourceId) ? uiBlocks : titleBlocks;
  const [movedField] = blocks.splice(result.source.index, 1);

  if (shouldCreateColumn(destinationId))
    return createColumn(movedField, setBuildArea, destinationId);

  return addToColumn(movedField, setBuildArea, destinationId, result);
}

const moveColumn = (result, buildArea, sourceId, destinationId) => {
  const sourceRow = getElement(sourceId, buildArea);
  const destinationRow = getElement(destinationId, buildArea);
  return moveToList(sourceRow, destinationRow, result);
}

const addRow = (result, buildArea, setBuildArea, isColumn, sourceId) => {
  const block = isColumn ? getElement(sourceId, buildArea) : get2Delement(sourceId, buildArea);
  const [deletedBlock] = block.splice(result.source.index, 1);
  return setBuildArea((prev) => [...prev, isColumn ? [deletedBlock] : [[deletedBlock]]]);
}

const moveField = (result, buildArea, setBuildArea, sourceId, destinationId) => {
  const column = get2Delement(sourceId, buildArea);
  const [deletedField] = column.splice(result.source.index, 1);
  // Create new column from field inside build area
  if (shouldCreateColumn(destinationId)) {
    return createColumn(deletedField, setBuildArea, destinationId);
  }
  // Move field to a column inside build area
  return addToColumn(deletedField, setBuildArea, destinationId, result);
}

const editBuildArea = (result, buildArea, setBuildArea, uiBlocks, titleBlocks) => {
  const sourceId = result.source.droppableId;
  const destinationId = result.destination.droppableId;
  // Moved from UI block list or title list
  if (isUIblockList(sourceId) || isTitleList(sourceId)) {
    return moveToBuildArea(result, setBuildArea, uiBlocks, titleBlocks, sourceId, destinationId);
  }
  // Moving column within build area
  if (isColumn(sourceId) && isColumn(destinationId)) {
    return moveColumn(result, buildArea, sourceId, destinationId);
  }
  // Create a new row from moving column from another row
  if (isColumn(sourceId) && shouldCreateRowWithColumn(destinationId)) {
    return addRow(result, buildArea, setBuildArea, true, sourceId);
  }
  // Making new row from field in buildArea
  if (isField(sourceId) && destinationId === "addRow") {
    return addRow(result, buildArea, setBuildArea, false, sourceId);
  }
  // Moving field inside of build area
  if (isField(sourceId)) {
    return moveField(result, buildArea, setBuildArea, sourceId, destinationId);
  }
}

export const onDragEnd = (result, buildArea, setBuildArea, setDragEnd, uiBlocks, titleBlocks) => {
    setDragEnd((prev) => !prev);
    // Cant move outside of droppable area
    if (!result.destination) return;

    const sourceId = result.source.droppableId;
    const destinationId = result.destination.droppableId;
    // Cant move ui block to title list
    if (sourceId === "uiBlocks-list" && destinationId === "title-list")
      return;
    // Cant move title to UIblock list
    if (sourceId === "title-list" && destinationId === "uiBlocks-list")
      return;
    // Make new row from UI block
    if (sourceId === "uiBlocks-list" && destinationId === "addRow")
      return addNewRow(result, uiBlocks, setBuildArea);
    // Make new row from title
    if (sourceId === "title-list" && destinationId === "addRow")
      return addNewRow(result, titleBlocks, setBuildArea);
    // Move within the same droppable area
    if (sourceId === destinationId) {
      return moveWithinArea(result, buildArea, uiBlocks, titleBlocks, sourceId);
    }
    if (movedToBuildArea(destinationId)) {
      return editBuildArea(result, buildArea, setBuildArea, uiBlocks, titleBlocks);
    }
    // Return block back to default lists
    // From build area to UIblocks list
    if (sourceId !== "uiBlocks-list" && destinationId === "uiBlocks-list") {
      return returnUiBlock(sourceId, buildArea, uiBlocks, result);
    }
    // From build area to title list
    if (sourceId !== "title-list" && destinationId === "title-list") {
      return returnTitleBlock(sourceId, buildArea, titleBlocks, result);
    }
  };