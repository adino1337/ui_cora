import { useState } from "react";
import "./Mark.css";
import { X, PenLine, Check } from "lucide-react";

export default function Mark(props) {
  const [nameEdit, setNameEdit] = useState(false);
  const [nameText, setNameText] = useState("");

  let active = props.activeMark === props.index ? "bold" : "normal";
  let border =
    props.activeMark === props.index
      ? `3px solid ${props.themeStyles.field}`
      : props.theme === "dark"
      ? `3px solid ${props.themeStyles.textPrimary}`
      : "3px solid black";
  return (
    <div className="mark">
      <div
        className="markText"
        style={{
          borderLeft: border,
        }}
        onClick={() => {
          props.changeMark(props.index);
        }}
      >
        {nameEdit ? (
          <form
            className="form"
            onSubmit={(e) => {
              e.preventDefault();
              if (nameText.length > 0) {
                props.setMarkNames((prev) =>
                  prev.map((name, id) => {
                    return id === props.index ? nameText : name;
                  })
                );
                setNameEdit(false);
              }
            }}
          >
            <input
              style={{
                color:
                  props.activeMark === props.index
                    ? props.themeStyles.field
                    : "black",
              }}
              className="input"
              type="text"
              value={nameText}
              onChange={(e) => setNameText(e.target.value)}
            />
          </form>
        ) : (
          <h3
            style={{
              cursor: "pointer",
              fontWeight: active,
              margin: "5px 0",
              color:
                props.activeMark === props.index
                  ? `${props.themeStyles.field}`
                  : props.theme === "dark"
                  ? `${props.themeStyles.textPrimary}`
                  : "black",
            }}
          >
            {props.markNames[props.index]}
          </h3>
        )}
      </div>
      {props.edit && props.index !== 0 && (
        <div className="icons">
          <X
            color={
              props.theme === "dark"
                ? props.activeMark === props.index
                  ? props.themeStyles.field
                  : "white"
                : props.activeMark === props.index
                ? props.themeStyles.field
                : "black"
            }
            size={18}
            onClick={() => props.deleteMark(props.index)}
          />
          {nameEdit ? (
            <Check
              color={
                props.theme === "dark"
                  ? props.activeMark === props.index
                    ? props.themeStyles.field
                    : "white"
                  : props.activeMark === props.index
                  ? props.themeStyles.field
                  : "black"
              }
              size={22}
              onClick={() => {
                if (nameText.length > 0) {
                  props.setMarkNames((prev) =>
                    prev.map((name, id) => {
                      return id === props.index ? nameText : name;
                    })
                  );
                  setNameEdit(false);
                }
              }}
            />
          ) : (
            <PenLine
              color={
                props.theme === "dark"
                  ? props.activeMark === props.index
                    ? props.themeStyles.field
                    : "white"
                  : props.activeMark === props.index
                  ? props.themeStyles.field
                  : "black"
              }
              size={22}
              onClick={() => setNameEdit(true)}
            />
          )}
        </div>
      )}
    </div>
  );
}
