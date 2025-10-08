// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import ReactDom from "./lib/react-dom/ReactDom.js";
import App from "./App.jsx";

function test() {
  console.log(test);
}
ReactDom.createRoot(document.getElementById("root")).render(
  <div id="oDiv" className="test" onChange={test}>
    <ul>
      <li>1</li>
      <li>2</li>
      <li>3</li>
      <li>4</li>
      <li>5</li>
      <li>6</li>
      <li>7</li>
    </ul>
  </div>
);
