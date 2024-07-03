import React, { useEffect, useState } from "react";
import UIGenerator from "./UIGenerator/UIGenerator";

function App() {
  const sleepTime = 300;
  // fake async call
  // UIschema is null until its not update call for a form
  const [data, setData] = useState({
    schema: null,
    UISchema: null,
    loading: true,
  });

  useEffect(() => {
    const fetchSchema = async () => {
      try {
        await new Promise((resolve) => setTimeout(resolve, sleepTime));
        const schema = await import("./schemas/schema_3.json");
        const UIschema = await import("./schemas/UI_3.json");
        setData({
          schema: schema.default,
          UISchema: UIschema.default,
          loading: false,
        });
      } catch (error) {
        setData({ schema: null, UISchema: null, loading: false });
      }
    };

    fetchSchema();
  }, []);

  if (data.loading) {
    // Loading component will be prolly in retec code base
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontSize: "3rem",
        }}
      >
        Loading...
      </div>
    );
  }

  return <UIGenerator schema={data.schema} UIschema={data.UISchema} />;
}

export default App;
