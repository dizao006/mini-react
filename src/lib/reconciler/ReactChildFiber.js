import createFiber from "./ReactFiber";
/**
 * 该方法用以协调子节点，设计diff算法
 * @param {*} returnFibers 父fiber，父节点
 * @param {*} children 子节点 Vnode数组
 */
export function reconCileChildren(returnFibers, children) {
  if (typeof children === "string") {
    // 文本节点 不需要处理，已经在updateNode中处理过了
    return;
  }
  // 准备工作 包装成数组
  // 如果只有一个子元素，那么children就是一个vnode节点，如果有多个就应该是数组
  // 所以进行统一处理
  const newChildren = Array.isArray(children) ? children : [children];
  //内存中存在两颗fiber树
  let previousNewFiber = null; // 上一个fiber对象
  let oldFiber = returnFibers.alternate && returnFibers.alternate.child; //上一个fiber对象对应的旧fiber对象
  let i = 0; //children数组的索引
  let lastPlacedIndex = 0; //上一次dom节点插入最远的位置
  //true表示组件更新，false为初次渲染
  let shouldTrackSideEffects = !!returnFibers.alternate; // 是否需要追踪副作用 Boolean值
  //   diff 两次遍历
  // 第一次便利，尝试逐个复用全部的节点，第二轮便利处理剩下的节点
  // 第一轮遍历
  for (; oldFiber && i < newChildren.length; i++) {
    // 第一次并不会进入，一开始并不存在oldfiber
  }
  // 从上面的循环出来存在两种情况
  // 1 oldfiber为null 初次渲染
  // 2 i===newChildren.length 说明所有的子节点已经处理完了，
  if (i === newChildren.length) {
    // 如果剩余旧节点，需要进行删除
  }
  // 初次渲染的情况
  if (!oldFiber) {
    // 说明是初次渲染,需要将newChildren数组的每个元素都生成一个fiber对象
    for (; i < newChildren.length; i++) {
      const newChildVnode = createFiber(newChildren[i]);
      if (newChildVnode === null) continue;
      // 下一步根据vnode生成新的fiber
      const newFiber = createFiber(newChildVnode, returnFibers);
      // 接下来进行更新
      lastPlacedIndex = placeChild(
        newFiber,
        lastPlacedIndex,
        i,
        shouldTrackSideEffects
      );
      // 接下来，将新生成的fiber加入fiber的链表中去
      if (previousNewFiber === null) {
        // 说明是第一个节点
        returnFibers.child = newFiber;
      } else {
        // 说明不是第一个节点
        previousNewFiber.sibling = newFiber;
      }
      //将当前fiber更新为上一个fiber
      previousNewFiber = newFiber;
    }
  }
}

/**
 * 更新lastPlacedIndex
 * @param {*} newFiber 新的fiber对象
 * @param {*} lastPlacedIndex 上一次dom节点插入最远的位置
 * @param {*} newIndex 新的索引
 * @param {*} shouldTrackSideEffects 是否需要追踪副作用 是否是更新
 */
function placeChild(
  newFiber,
  lastPlacedIndex,
  newIndex,
  shouldTrackSideEffects
) {
  newFiber.index = newIndex; // 跟新fiber身上的index 记录当前fiber节点在当前层级的位置
  if (shouldTrackSideEffects) {
    // 说明为初次渲染 说明不需要记录节点位置 //记录复用
    return lastPlacedIndex;
  }
}
