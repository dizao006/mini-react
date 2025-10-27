import createFiber from "../reconciler/ReactFiber";
import scheduleUpdateOnFiber from "../reconciler/ReactFiberWorkLoop";
/**
 *
 * @param {*} childrenTree 要挂载的Fiber树
 * @param {*} container 根节点
 */
function updateContainer(childrenTree, container) {
  const fiber = createFiber(childrenTree, {
    // 父Fiber
    type: container.nodeName.toLowerCase(),
    stateNode: container,
  });
  scheduleUpdateOnFiber(fiber);
}

class ReactDomRoot {
  constructor(container) {
    this._internalRoot = container;
  }
  /**
   *
   * @param {*} children 要挂载到根节点的Fiber
   */
  render(children) {
    updateContainer(children, this._internalRoot);
  }
}

const ReactDom = {
  /**
   *
   * @param {*} container 挂在的根节点dom
   * @returns 返回一个对象，身上有render方法
   */
  createRoot(container) {
    return new ReactDomRoot(container);
  },
};
export default ReactDom;
