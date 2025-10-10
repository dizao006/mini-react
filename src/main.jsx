// import { StrictMode } from "react";
// import { createRoot } from "react-dom/client";
import ReactDom from "./lib/react-dom/ReactDom.js";
import App from "./App.jsx";

function test() {
  console.log(test);
}
ReactDom.createRoot(document.getElementById("root")).render(
  <App id="test"></App>
);
