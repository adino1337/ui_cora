export default function LineBtn({setBuildArea}) {
  return (
    <button
      onClick={() => {
        setBuildArea((prev) => {
          return [...prev, [[{ type: "line" }]]]; // type which is in customComponentsConfig.js 
        });
      }}
    >
      Čiara
    </button>
  );
}
