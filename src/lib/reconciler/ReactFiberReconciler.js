//
import { updateNode } from "../shared/utils";
import { reconCileChildren } from "./ReactChildFiber";
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
    console.log(wip.stateNode);
    // 解析来处理子节点
    reconCileChildren(wip, wip.props.children);
    // 处理完了所有的子节点
  }
  // 将真实dom挂载到fiber的stateNode属性上
}

export function updateHostTextComponent(wip) {
  wip.stateNode = document.createTextNode(wip.props.children);
}
