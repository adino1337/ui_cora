export default function LineBtn({setBuildArea}) {
  return (
    <button
      onClick={() => {
        setBuildArea((prev) => {
          return [...prev, [[{ type: "line" }]]];
        });
      }}
    >
      Čiara
    </button>
  );
}
