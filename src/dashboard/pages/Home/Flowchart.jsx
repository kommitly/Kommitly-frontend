import React from "react";
import Mermaid from "react-mermaid2";

const FlowChart = () => {
  const diagram = `
    graph TD
      A[Set a Goal] --> B{Break into Tasks}
      B -->|AI Breakdown| C[Task 1]
      B --> C2[Task 2]
      B --> C3[Task 3]
      C --> D[Complete Task 1]
      C2 --> D2[Complete Task 2]
      C3 --> D3[Complete Task 3]
      D & D2 & D3 --> E[Goal Achieved]
  `;

  return <Mermaid chart={diagram} />;
};

export default FlowChart;
