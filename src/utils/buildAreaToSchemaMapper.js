const buildAreaToSchemaMapper = () => {
  //TODO: ADD MARKS
  let fieldData = buildArea.map((row) =>
    row.map((col) =>
      col.map((field) => {
        if (field.type === "title") {
          let TitleText = field.title.split(" ");
          TitleText.shift();
          let text = TitleText.join(" ");
          if (field.className === null)
            return {
              title: text,
            };
          else
            return {
              title: text,
              className: field.className,
            };
        } else if (field.type === "line")
          return {
            customComponent: "Line",
          };
        else {
          if (field.className === null)
            return {
              field: field.field,
            };
          else
            return {
              field: field.field,
              className: field.className,
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
};

export default buildAreaToSchemaMapper;
