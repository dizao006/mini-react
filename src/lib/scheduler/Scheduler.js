import { getCurrentTime } from "../shared/utils";
/**
 * 调度器 scheduler
 */
import { push, pop, peek } from "./SchedulerMinHeap";

// 任务队列
const taskQueue = [];

// 任务id计数器
let taskIdCounter = 0;

// 是否有剩余时间
let hasTimeReamaining = true;

// 通过MessageChannel来模拟
const { port1, port2 } = new MessageChannel();
console.log(port1, port2, "======");
/**
 * 调度器回调函数，组装任务对象，然后将其放入到任务队列中
 * @param {*} callback 回调函数,表示需要执行的任务，表示会在每一帧有剩余时间的时候去执行
 */
export default function schedulerCallBack(callback) {
  // 获取当前时间
  const currentTime = getCurrentTime();
  // 设置任务过期时间，在react针对不同的任务类型设置不同的过期时间
  // 我们假设所有的任务优先级相同
  const timeout = -1;
  // 任务过期时间
  const expirationTime = currentTime + timeout;
  const newTask = {
    id: taskIdCounter++,
    callback,
    expirationTime,
    sortIndex: expirationTime, // 这里回头会根据sortIndex进行排序
  };
  // 将任务添加到任务队列中
  push(taskQueue, newTask);

  // 创建请求调度，产生宏任务
  port1.postMessage(null);
}
// 在prot2中，会去执行任务队列的任务
port2.onmessage = function () {
  // 不停的从任务队列中取出任务执行
  const currentTime = getCurrentTime();
  // 取出第一个任务
  let currentTask = peek(taskQueue);

  while (currentTask) {
    // 如果任务过期时间大于当前时间，则当前任务不着急，可以延期执行，并且剩下帧的时间也足够执行
    if (currentTask.expirationTime > currentTask && !hasTimeReamaining) {
      break;
    }
    // 需要执行
    const callback = currentTask.callback;
    currentTask.callback = null;
    // 执行任务
    const result = callback(currentTime - currentTask.expirationTime);
    // 如果任务返回了新的任务，则将新的任务添加到任务队列中
    if (result === undefined) {
      // 说明任务执行完毕，才会退出，就可以将任务进行删除
      pop(taskQueue);
      currentTask = peek(taskQueue);
    }
  }
};
