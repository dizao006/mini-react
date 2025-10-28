import React from "./lib/react/React";
import { useState, useReducer, useEffect } from "./lib/react/ReactHooks";

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return state + 1;
    case "decrement":
      return state - 1;
    default:
      return state;
  }
}

function App({ id }) {
  const [count, setCount] = useState(0);
  const [state, dispatch] = useReducer(reducer, 0);
  useEffect(() => {
    console.log("useEffect", count);
    return () => {
      console.log("useEffect cleanup", count);
    };
  }, [count]);
  return (
    <div id={id}>
      <h1>Hello World</h1>
      <div>
        <button onClick={() => setCount(count - 1)}>-</button>
        <span>{count}</span>
        <button onClick={() => setCount(count + 1)}>+</button>
      </div>
      <button onClick={() => dispatch({ type: "increment" })}>{state}</button>

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
