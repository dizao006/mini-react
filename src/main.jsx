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
      <li>苹果</li>
      <li>香蕉</li>
      <li>橘子</li>
    </ul>
    <p>123</p>
  </div>
);
