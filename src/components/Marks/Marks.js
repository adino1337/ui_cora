import "./Marks.css";

export default function Marks(props) {
  return (
    <div className="marks">
      <div className="markText">Formulár</div>
      {props.edit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button className="addMark">+</button>
        </div>
      )}
    </div>
  );
}
