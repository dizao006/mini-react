import createFiber from "./ReactFiber";
import {
  sameNode,
  placeChild,
  deleteRemainingChildren,
  mapRemainingChildren,
  deleteChild,
} from "./ReactChildAssistant";
import { Update } from "../shared/utils";
/**
 * 该方法用以协调子节点，设计diff算法
 * @param {*} returnFibers 父fiber，父节点
 * @param {*} children 子节点 Vnode数组
 */
export function reconCileChildren(returnFibers, children) {
  if (typeof children === "string" || typeof children === "number") {
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
  let lastPlacedIndex = 0; //标识 上一次dom节点插入最远的位置
  //true表示组件更新，false为初次渲染
  let shouldTrackSideEffects = !!returnFibers.alternate; // 是否需要追踪副作用 Boolean值
  let nextOldFiber = null; // 下一个旧fiber对象 临时存储当前的旧的fiber对象

  //   diff 两次遍历
  /**
   * 第一轮遍历，从左往右vnode，在遍历的时候比较新旧节点（旧节点为fiber对象）
   * 如果能够进行复用，则循环往右
   * 如果不能复用，则跳出循环，结束第一轮便利
   * 2 检查newChildren，是否完成便利，因为从上面循环出来两种情况 1 完成遍历，2 无法复用跳出
   * 如果新节点完成了整个遍历，但是旧节点有剩余，则删除旧节点的剩余
   * 3 初次渲染
   * 旧节点遍历完了，但是新节点存在剩余，则需要进行创建新节点，那么新节点就属于重新渲染
   * 4 处理新旧节点都还有剩余的情况
   *    1 将剩余的旧节点放到map中，map的key是旧节点的key，value是旧节点
   *    2 遍历剩余的新节点，通过新节点的key去map中查找对应的旧节点，看看能否进行复用
   *      如果有进行复用，并且删除map中的旧节点
   * 5 整个新节点遍历完后，如果map中还存在剩余的旧节点，那么剩余的旧节点就是需要删除的节点
   */

  // 第一次便利，尝试逐个复用全部的节点，第二轮便利处理剩下的节点
  // 第一轮遍历
  for (; oldFiber && i < newChildren.length; i++) {
    // 第一次并不会进入，一开始并不存在oldfiber
    const newChild = newChildren[i];
    if (newChild === null) continue; // 如果为null，则跳过当前循环
    // 在判断能否复用之前，先给nextOldFiber赋值
    // 一种特殊情况，比如1 2 3 4 5  下标对应的 0 1 2 3 4，现在进行了一些修改，只剩下了5和4
    // old>>>5(4) 4(3)
    // new>>>4(3) 1 2 3 5(4)
    // 此时旧节点的index是大于i的，因此需要把nextOldFiber暂存为oldFiber
    if (oldFiber.index > i) {
      nextOldFiber = oldFiber;
      oldFiber = null;
    } else {
      nextOldFiber = oldFiber.sibling;
    }
    // 下一步判断是否能够进行复用 切记是新的结点和旧的fiber进行对比
    const same = sameNode(newChild, oldFiber);
    if (!same) {
      if (oldFiber === null) {
        // 需要将oldFiber原本的值进行还原nextOldFiber暂存了之前的值
        oldFiber = nextOldFiber;
      }
      // 无法复用，跳出循环，第一轮遍历结束
      break;
    }
    // 如果没有进入上面的判断，则当前节点能够进行复用
    const newFiber = createFiber(newChild, returnFibers); // 复用并不是不创造fiber对象，复用实际上复用dom结构,不再去创建新的dom对象
    // 复用旧fiber上面的信息，特别是Dom节点
    Object.assign(newFiber, {
      stateNode: oldFiber.stateNode,
      alternate: oldFiber,
      flags: Update,
    });
    // 更新lastPlacedIndex的值
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    );
    // 最后需要将newFiber加入到链表中
    if (previousNewFiber === null) {
      // 说明是第一个节点
      returnFibers.child = newFiber;
    } else {
      // 说明不是第一个节点
      previousNewFiber.sibling = newFiber;
    }
    //将当前fiber更新为上一个fiber
    previousNewFiber = newFiber;
    // 将oldFiber更新为下一个旧fiber
    oldFiber = nextOldFiber;
  }
  // 从上面的循环出来存在两种情况
  // 1 oldfiber为null 初次渲染
  // 2 i===newChildren.length 说明所有的子节点已经处理完了，
  if (i === newChildren.length) {
    // 如果剩余旧节点，需要进行删除
    deleteRemainingChildren(returnFibers, oldFiber);
    return;
  }
  // 第三步 初次渲染的情况
  if (!oldFiber) {
    // 说明是初次渲染,需要将newChildren数组的每个元素都生成一个fiber对象
    for (; i < newChildren.length; i++) {
      const newChildVnode = newChildren[i]
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
  // 第四步 处理新旧节点都还有剩余的情况
  // 创建一个map，存储旧节点的key和fiber对象

  const existingChildren = mapRemainingChildren(returnFibers, oldFiber);
  // 遍历剩余的新节点
  for (; i < newChildren.length; i++) {
    // 拿到当前的vnode
    const newChild = newChildren[i];
    if (newChild === null) continue;
    // 根据当前节点的vNode生成新的fiber
    const newFiber = createFiber(newChild, returnFibers);
    // 接下来去map中寻找能否复用的
    const matchedFiber = existingChildren.get(newFiber.key || newFiber.index);
    if (matchedFiber) {
      // 如果找到了，可以进行节点复用
      // 复用旧fiber上面的信息，特别是Dom节点
      Object.assign(newFiber, {
        stateNode: matchedFiber.stateNode,
        alternate: matchedFiber,
        flags: Update,
      });
      // 删除map中的旧fiber
      existingChildren.delete(matchedFiber.key || matchedFiber.index);
    }
    // 更新lastPlacedIndex的值
    lastPlacedIndex = placeChild(
      newFiber,
      lastPlacedIndex,
      i,
      shouldTrackSideEffects
    );
    // 将新生成的fiber加入fiber的链表中去
    if (previousNewFiber === null) {
      // 说明是第一个节点
      returnFibers.child = newFiber;
    } else {
      // 说明不是第一个节点
      previousNewFiber.sibling = newFiber;
    }
    //将当前fiber更新为上一个fiber
    previousNewFiber = newFiber;

    // 第五步 如果map中还存在剩余的旧节点，那么剩余的旧节点就是需要删除的节点
    if (existingChildren.size > 0) {
      existingChildren.forEach((child) => {
        deleteChild(returnFibers, child);
      });
    }
  }
}
