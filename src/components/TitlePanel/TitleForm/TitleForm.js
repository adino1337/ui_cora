import { useState } from "react";
import "./TitleForm.css";
export default function TitleForm(props) {
  const [titleText, setTitleText] = useState("");

  return (
    <form
      className="titleInputBox"
      onSubmit={(e) => {
        e.preventDefault();
        if (titleText.length) {
          props.setTitleBlocks((prev) => [
            {
              type: "title",
              title: "Nadpis: " + titleText,
              field: titleText + "-" + Date.now(),
            },
            ...prev,
          ]);
          setTitleText("");
        }
      }}
    >
      <input
        value={titleText}
        onChange={(e) => setTitleText(e.target.value)}
        placeholder="Nadpis"
        style={{ color: "black" }}
      />
      <button>Pridať Nadpis</button>
    </form>
  );
}
