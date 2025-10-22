import React from "./lib/react/React";
import { useState } from "react";
function App({ id }) {
  // const [count, setCount] = useState(0);

  return (
    <div id={id}>
      <h1>Hello World</h1>
      {/* <button onClick={() => setCount(count + 1)}>Click me</button>
      <p>Count: {count}</p> */}
      <ul>
        <li>苹果</li>
        <li>香蕉</li>
        <li>橘子</li>
        <li>葡萄</li>
      </ul>
      <p>123</p>
    </div>
  );
}

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       name: "张三",
//     };
//   }
//   render() {
//     return (
//       <div id={this.props.id}>
//         <h1>Hello World</h1>
//         <ul>
//           <li>苹果</li>
//           <li>香蕉</li>
//           <li>橘子</li>
//           <li>葡萄</li>
//         </ul>
//         <p>123</p>
//       </div>
//     );
//   }
// }
export default App;
