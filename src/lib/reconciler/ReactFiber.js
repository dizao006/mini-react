import { Placement } from "../shared/utils";
import {
  FunctionComponent,
  ClassComponent,
  HostComponent,
  HostText,
  Fragment,
} from "./ReactWorkTags";
/**
 *
 * @param {*} vnode 要挂载的Vnode
 * @param {*} returnFiber 父Fiber
 * @returns 返回一个Fiber
 */
function createFiber(vnode, returnFiber) {
  const fiber = {
    type: vnode.type, // 类型
    key: vnode.key, // 唯一标识
    props: vnode.props, // 属性
    stateNode: null, // 存储当前fiber对应的dom节点  链表形式
    return: returnFiber, // 父Fiber
    child: null, // 第一个子Fiber
    sibling: null, // 下一个兄弟Fiber
    flags: Placement, // 副作用
    index: null, // 当前节点在当前层级的位置
    alternate: null, // 旧的fiber 双缓冲
  };
  //剩下一个tag，取决于fiber的type值,不同的fiber类型有不同的tag
  if (typeof vnode.type === "string") {
    fiber.tag = HostComponent;
  } else if (typeof vnode.type === "function") {
    if (vnode.type.prototype.isReactComponent) {
      fiber.tag = ClassComponent;
    } else {
      fiber.tag = FunctionComponent;
    }
  } else if (typeof vnode.type === "undefined") {
    fiber.tag = HostText;
    // 文本节点不存在props，我们将手动设置props
    fiber.props = {
      children: vnode,
    };
  } else {
    fiber.tag = Fragment;
  }
  console.log(fiber);
  return fiber;
}

export default createFiber;
