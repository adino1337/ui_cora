import React from "react";
import "./Marks.css";
import { Trash2 } from "lucide-react";

export default function Marks({
  edit,
  marks,
  activeMark,
  addMark,
  switchMark,
  deleteMark,
}) {
  return (
    <div className="marks">
      {marks.map((_, index) => (
        <div className={`mark-text ${activeMark === index && "active"}`}>
          <p className="mark-title" key={index} onClick={() => switchMark(index)}>
            {index === 0 ? "Formulár" : `Záložka ${index}`}
          </p>
          {edit && index !== 0 && <Trash2 onClick={() => deleteMark(index)} />}
        </div>
      ))}
      {edit && (
        <button onClick={addMark} className="add-mark">
          +
        </button>
      )}
    </div>
  );
}
