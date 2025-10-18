import { beginWork } from "./ReactFiberBeginWork";
import completeWork from "./ReactFiberCompleteWork";
import commitWork from "./ReactFiberCommit";
import schedulerCallBack from "../scheduler/Scheduler";
// 负责整个react的执行流程
let wip = null; // work iun progress 保存当前进行工作的fiber
let wipRoot = null; // 保存当前进行工作的fiber的根节点
function scheduleUpdateOnFiber(fiber) {
  wip = fiber;
  wipRoot = fiber;
  // 后续使用schedule
  schedulerCallBack(workLoop);
}
// /**
//  * 在每一帧有空闲的时候执行
//  * @param {} deadline
//  */
// function workLoop(deadline) {
//   while (wip && deadline.timeRemaining() > 0) {
//     //说明有需要进行处理的fiber，并且也有时间处理
//     performUnitOfWork(); //处理fiber节点
//   }
//   //没时间或wip为null，说明不需要处理
//   // 全部执行完，则需要渲染
//   if (!wip) {
//     commitRoot();
//   }
// }
/**
 *
 * @param {*} time 时间参数，如果超过改时间则不处理下一个fiber
 */
function workLoop(time) {
  while (wip) {
    if (time < 0) return false;
    // 说明时间够用，处理fiber
    performUnitOfWork();
  }
  if (!wip && wipRoot) {
    commitRoot();
  }
}
/**
 * 处理fiber节点
 * @param {*} fiber
 * 1 处理当前的fiber
 * 2 深搜生成子节点的fiber处理
 * 3 处理副作用
 * 4 进行渲染
 */
function performUnitOfWork() {
  beginWork(wip);
  if (wip.child) {
    wip = wip.child;
    return;
  }
  completeWork(wip);
  // 如果没有子节点，则找兄弟节点
  let next = wip;
  while (next) {
    if (next.sibling) {
      wip = next.sibling;
      return;
    }
    // 说明当前节点已经没有兄弟节点了，需要将父节点设置为当前正在工作的节点
    //在父亲那一层继续寻找兄弟层
    next = next.return;
    // 在寻找父节点之前，先进行 completeWork
    completeWork(next);
  }
  //如果没有节点要执行了，说明fiber树已经处理完了
  wip = null;
}
/**
 * 执行该方法的时候，说明整个节点的协调工作已经完成
 * 解析来进行渲染
 */
function commitRoot() {
  commitWork(wipRoot);
  wipRoot = null;
}

export default scheduleUpdateOnFiber;
