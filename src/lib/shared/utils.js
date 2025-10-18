/**
 * 对fiber对象要做的操作的标记
 */

export const NoFlags = 0b00000000000000000000000000000000; //1

export const Placement = 0b0000000000000000000000000000010; //2

export const Update = 0b0000000000000000000000000000100; //4

export const Deletion = 0b0000000000000000000000000001000; //8

/**
 * 更新dom节点属性
 * @param {*} stateNode 真实dom
 * @param {*} preval 旧的属性
 * @param {*} nextVal 新的属性
 */
export function updateNode(stateNode, preVal, nextVal) {
  // 对旧值进行处理
  Object.keys(preVal).forEach((k) => {
    if (k === "children") {
      // 需要判断children是否为字符串，如果是字符则代表为文本节点
      if (typeof preVal[k] === "string") {
        stateNode.textContent = "";
      } else if (k.startsWith("on")) {
        // 说明绑定的事件，对旧值进行移除
        // 如果是onchange，背后实际上绑定的input
        let eventName = k.slice(2).toLowerCase();
        if (eventName === "change") {
          eventName = "input";
        }
        stateNode.removeEventListener(eventName, preVal[k]);
      } else {
        // 普通属性 例如 id className
        // 如果新值是否存在这个属性
        if (!(k in nextVal)) {
          stateNode[k] = "";
        }
      }
    }
  });
  // 对新值进行处理，与上面反正操作
  Object.keys(nextVal).forEach((k) => {
    if (k === "children") {
      if (typeof nextVal[k] === "string") {
        stateNode.textContent = nextVal[k];
      }
    } else if (k.startsWith("on")) {
      // 绑定时间
      let eventName = k.slice(2).toLowerCase();
      if (eventName === "change") {
        eventName = "input";
      }
      stateNode.addEventListener(eventName, nextVal[k]);
    } else {
      // 说明普通属性
      if (k in nextVal) {
        stateNode[k] = nextVal[k];
      }
    }
  });
}
// 获取当前时间
export function getCurrentTime() {
  return performance.now();
}
