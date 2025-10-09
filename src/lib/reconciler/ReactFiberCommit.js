/**
 *
 * @param {*} wip
 */
function commitWork(wip) {
  if (!wip) return;
  // 整个commitwork分三步走
  // 1 提交自己
  // 2提交子节点
  // 3 提交兄弟
  commitNode(wip); // 提交自己
  commitWork(wip.child); // 提交子节点
  commitWork(wip.sibling); // 提交兄弟
}
/**
 *
 */
function commitNode(wip) {
  // 1拿到fiber所对于的父节点的dom对象
  const parentDom = getParentDom(wip.return);
  // 2 进行dom操作
  if (wip.stateNode) {
    parentDom.appendChild(wip.stateNode);
  }
}
function getParentDom(wip) {
  let temp = wip;
  while (temp) {
    if (temp.stateNode) {
      return temp.stateNode;
    }
    // 如果没有进入上面的if，那么说明当前fiber节点没有对应的dom对象
    // 那么需要向上搜寻（因为fiber节点可能是Fragment、函数组件、类组件 类型的节点）

    temp = temp.return;
  }
  return null;
}
export default commitWork;
