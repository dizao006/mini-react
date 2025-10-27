//
import { updateNode } from "../shared/utils";
import { reconCileChildren } from "./ReactChildFiber";
import { renderWithHooks } from "../react/ReactHooks";
/**
 *
 * @param {*} wip 需要处理的fiber节点
 */
export function updateHostComponent(wip) {
  // 创建真实 的dom
  if (!wip.stateNode) {
    // 说明没有真实的dom
    wip.stateNode = document.createElement(wip.type);
    // 更新节点属性
    updateNode(wip.stateNode, {}, wip.props);
  }
  // 解析来处理子节点
  reconCileChildren(wip, wip.props.children);
  // 处理完了所有的子节点
  // 将真实dom挂载到fiber的stateNode属性上
}
// 处理文本节点
export function updateHostTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children);
}

// 处理更新函数组件
export function updateFunctionComponent(wip) {
  // 获取函数组件的函数
  // 那么子啊处理fiber树之前，我们需要先处理hooks
  renderWithHooks(wip);

  // 有了hooks之后，后面处理fiber树
  const { type, props } = wip;
  // 执行函数组件，获取返回的虚拟dom为children
  const nextChildren = type(props);
  // 更新子节点
  reconCileChildren(wip, nextChildren);
}

// 处理类组件
export function updateClassComponent(wip) {
  const { type, props } = wip;
  const instance = new type(props); //拿到实例对象，调用render方法拿到vNode
  const nextChildren = instance.render();
  reconCileChildren(wip, nextChildren);
}

// 处理Fragment节点
export function updateFragment(wip) {
  // Fragment不需要创建真实DOM，只需要处理子节点
  reconCileChildren(wip, wip.props.children);
}