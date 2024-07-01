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


export const onDragEnd = (result, buildArea, setBuildArea, setDragEnd, uiBlocks, titleBlocks) => {
    setDragEnd((prev) => !prev);
    if (!result.destination) return;
    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;
    // Make new row from UI block
    if (sourceList === "uiBlocks-list" && destinationList === "addRow") {
      return addNewRow(result, uiBlocks, setBuildArea);
      //const [movedField] = uiBlocks.splice(result.source.index, 1);
      //return setBuildArea((prev) => [...prev, [[movedField]]]);
    }
    // Cant move ui block to title list
    if (sourceList === "uiBlocks-list" && destinationList === "title-list")
      return;
    // Make new row from title
    if (sourceList === "title-list" && destinationList === "addRow") {
      return addNewRow(result, titleBlocks, setBuildArea);
      //const [movedField] = titleBlocks.splice(result.source.index, 1);
      //return setBuildArea((prev) => [...prev, [[movedField]]]);
    }
    // Cant move title to UIblock list
    if (sourceList === "title-list" && destinationList === "uiBlocks-list")
      return;
    if (sourceList === destinationList) {
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
        const rowId = getRowId(sourceList);
        const columnId = getColumnId(sourceList);
        const column = buildArea[rowId][columnId];
        return updateList(column, result);
      }
      // Move of column within same row
      if (isColumn(sourceList)) {
        const rowId = getRowId(sourceList);
        const row = buildArea[rowId];
        return updateList(row, result);
      }
      // Move of row within build area
      if (isRow(sourceList)) {
        return updateList(buildArea, result);
      }
    }
    if (movedToBuildArea(destinationList)) {
      // Moved from UI block list or title list
      if (isUIblockList(sourceList) || isTitleList(sourceList)) {
        const blocks = isUIblockList(sourceList) ? uiBlocks : titleBlocks;
        const [movedField] = blocks.splice(result.source.index, 1);
        if (shouldCreateColumn(destinationList)) {
          return createColumn(movedField, setBuildArea, destinationList);
        }
        return addToColumn(movedField, setBuildArea, destinationList, result);
      }
      // Moving column within build area
      if (isColumn(sourceList) && isColumn(destinationList)) {
        const sourceRowId = getRowId(sourceList);
        const destinationRowId = getRowId(destinationList);
        const sourceRow = buildArea[sourceRowId];
        return moveToList(sourceRow, buildArea[destinationRowId], result);
      }
      // Create a new row from moving column from another row
      if (isColumn(sourceList) && shouldCreateRowWithColumn(destinationList)) {
        const sourceRowId = getRowId(sourceList);
        const sourceRow = buildArea[sourceRowId];
        const [deletedColumn] = sourceRow.splice(result.source.index, 1);
        return setBuildArea((prev) => [...prev, [deletedColumn]]);
      }
      // Making new row from field in buildArea
      if (isField(sourceList) && destinationList === "addRow") {
        const rowId = getRowId(sourceList);
        const columnId = getColumnId(sourceList);
        const column = buildArea[rowId][columnId];
        const [movedField] = column.splice(result.source.index, 1);
        return setBuildArea((prev) => [...prev, [[movedField]]]);
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