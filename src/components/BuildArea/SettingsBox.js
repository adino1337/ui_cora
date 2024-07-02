import { Settings } from "lucide-react";
import { useState } from "react";

export default function SettingsBox(props) {
  const [openClassMenu, setOpenClassMenu] = useState(false);

  function onChangeValue(event) {
    props.setStencil(event.target.value);
    console.log(event.target.value);
  }

  let border = "3px solid black";

  return (
    <div className="settings">
      <Settings
        className="icon"
        size={18}
        color={"black"}
        onClick={() => setOpenClassMenu((prev) => !prev)}
      />
      {openClassMenu && (
        <>
          <div
            className="stvorec"
            style={{
              background: "black",
            }}
          ></div>

          <div
            className="radioButtons"
            style={{ border: border }}
            onChange={onChangeValue}
          >
            <h4>Šablóna</h4>
            <div className="inputBox">
              <label for={`15|85 ${props.rowIndex}`}>15% | 85%</label>
              <input
                type="radio"
                name={`stencil${props.rowIndex}`}
                value="15|85"
                id={`15|85 ${props.rowIndex}`}
                checked={props.stencil === "15|85"}
              />
            </div>
            <div className="inputBox">
              <label for={`85|15 ${props.rowIndex}`}>85% | 15%</label>
              <input
                type="radio"
                name={`stencil${props.rowIndex}`}
                value="85|15"
                id={`85|15 ${props.rowIndex}`}
                checked={props.stencil === "85|15"}
              />
            </div>

            <div className="inputBox">
              <label for={`50|50 ${props.rowIndex}`}>50% | 50%</label>
              <input
                type="radio"
                name={`stencil${props.rowIndex}`}
                value="50|50"
                id={`50|50 ${props.rowIndex}`}
                checked={props.stencil === "50|50"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
