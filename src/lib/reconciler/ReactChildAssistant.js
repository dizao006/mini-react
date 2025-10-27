// 为计算diff算法提供计算方法
import { Placement } from "../shared/utils";
/**
 *
 * @param {*} a 新的vnode节点
 * @param {*} b 旧的fiber节点
 * 判断是否相同
 * 1 同一层级
 * 2 类型相同
 * 3 key相同
 */
export function sameNode(a, b) {
  return a && b && a.type === b.type && a.key === b.key;
}

/**
 * 更新lastPlacedIndex
 * @param {*} newFiber 新的fiber对象
 * @param {*} lastPlacedIndex 上一次dom节点插入最远的位置
 * @param {*} newIndex 新的索引
 * @param {*} shouldTrackSideEffects 是否需要追踪副作用 是否是更新
 * 例如  old>>>1 2 3 4 5
 *       new>>> 5 1 2 3 4
 * 此时lastPlacedIndex记录的就应该是5
 * 通过记录这个值，能够判断当前的fiber是修改还是移动
 */
export function placeChild(
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
  const current = newFiber.alternate; //拿到旧的fiber
  if (current) {
    // 获取到旧fiber的index值
    const oldIndex = current.index;
    if (oldIndex < lastPlacedIndex) {
      // 表示应该是移动的
      newFiber.flags |= Placement; // 或运算 表示在原来的基础上加上Placement
      return lastPlacedIndex;
    } else {
      // 说明当前节点需要修改，说明oldIndex应该作为lastPlacedIndex
      return oldIndex;
    }
  } else {
    // 进入这里表示当前fiber是初次渲染
    newFiber.flags |= Placement;
    return lastPlacedIndex;
  }
}

/**
 *
 * @param {*} returnFibers 父fiber
 * @param {*} currentFirstChild 要删除的旧fiber的第一个子fiber
 * 删除多个节点，核心在于一个个删除
 */
export function deleteRemainingChildren(returnFibers, currentFirstChild) {
  let childToDelete = currentFirstChild;
  while (childToDelete) {
    deleteChild(returnFibers, childToDelete);
    childToDelete = childToDelete.sibling;
  }
}
/**
 *
 * @param {*} returnFibers 父fiber
 * @param {*} childToDelete 要删除的子fiber
 * 这里并不是真正的删除，而是将要删除的fiber放到一个数组中，等到所有的fiber都处理完后，再进行删除
 */
export function deleteChild(returnFibers, childToDelete) {
  const deletions = returnFibers.deletions; // deletions是一个数组，存储的是要删除的fiber对象
  if (deletions) {
    returnFibers.deletions.push(childToDelete); // 将要删除的fiber对象添加到deletions数组中
  } else {
    returnFibers.deletions = [childToDelete]; // 如果deletions数组不存在，则创建一个数组，并将要删除的fiber对象添加到数组中
  }
}
/**
 *
 * @param {*} returnFibers
 * @param {*} currentFirstChild
 * 将剩余的旧的子节点构建成一个哈希表
 */
export function mapRemainingChildren(returnFibers, currentFirstChild) {
  const existingChildren = new Map();
  let existingChild = currentFirstChild;
  while (existingChild) {
    existingChildren.set(
      existingChild.key || existingChild.index,
      existingChild
    );
    // 切换到下一个兄弟节点
    existingChild = existingChild.sibling;
  }
  return existingChildren;
}
