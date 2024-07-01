import Mark from "../Mark/Mark";
import "./Marks.css";
import { ThemeButtons } from "../../assets/themes";

export default function Marks(props) {
  return (
    <div className="marks">
      {props.marks.map((mark, i) => {
        return (
          <Mark
            activeMark={props.activeMark}
            themeStyles={props.themeStyles}
            theme={props.theme}
            index={i}
            edit={props.edit}
            markNames={props.markNames}
            changeMark={props.changeMark}
            deleteMark={props.deleteMark}
            setMarkNames={props.setMarkNames}
          />
        );
      })}
      {props.edit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => {
              props.setMarks((prevMarks) => [...prevMarks, []]);
              props.setMarkNames((prevNames) => [
                ...prevNames,
                `Záložka ${prevNames.length}`,
              ]);
              props.setButtonClicked(true);
            }}
            style={{
              cursor: "pointer",
              border: "none",
              outline: "none",
              width: "35px",
              height: "35px",
              borderRadius: "50%",
              backgroundColor: `${props.themeStyles.field}`,
              color: `${props.themeStyles.textPrimary}`,
              fontSize: "24px",
            }}
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}
