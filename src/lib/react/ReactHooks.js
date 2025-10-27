import scheduleUpdateOnFiber from "../reconciler/ReactFiberWorkLoop";

/**
 * 该文件用于实现各种hooks
 */
// 定义一些全局遍变量
let currentlyRenderingFiber = null; // 当前正在渲染的fiber对象
let workInProgressHook = null; // 当前正在渲染的hook
let currentHook = null; // 当前的hook对象
/**
 * 对当前这颗fiber以及hooks初始化
 * @param {*} wip fiber对象
 */
export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip; // 将当前正在渲染的fiber对象赋值给全局变量
  currentlyRenderingFiber.memoizedState = null; // 初始化memoizedState
  workInProgressHook = null; // 初始化workInProgressHook
  currentlyRenderingFiber.updateQueue = []; // 存储Effect副作用钩子的数组
}

/**
 *
 * @param {*} initialState  初始化状态
 */
export function useState(initialState) {
  return useReducer(null, initialState);
}

/**
 * 获取最新的hook,并且将workInProgressHook指向最新的hook
 * 返回最新的hook对象
 */
function updateWorkInProgressHook() {
  let hook = null; //最终返回的hook
  const current = currentlyRenderingFiber.alternate; // 旧的fiber对象
  if (current) {
    // 说明不是第一次渲染，存在旧的值
    currentlyRenderingFiber.memoizedState = current.memoizedState;
    if (workInProgressHook) {
      // 说明链表存在
      workInProgressHook = hook = workInProgressHook.next;
      currentHook = currentHook.next;
    } else {
      // 如果链表不存在
      workInProgressHook = hook = currentlyRenderingFiber.memoizedState;
      currentHook = current.memoizedState;
    }
  } else {
    // 说明是第一次渲染，不存在旧的值,什么都没有
    hook = {
      memoizedState: null, //存储的状态
      next: null, // 下一个hook指针
    };
    if (workInProgressHook) {
      // 检查链表
      // 说明当前hook不是第一个hook，存在其他hook
      //workInProgressHook始终指向最新的hook
      workInProgressHook = workInProgressHook.next = hook;
    } else {
      // 说明是第一个hook
      workInProgressHook = currentlyRenderingFiber.memoizedState = hook;
    }
  }
  return hook;
}

/**
 *
 * @param {*} reducer  改变状态的reducer函数
 * @param {*} initialState 初始化状态
 */
export function useReducer(reducer, initialState) {
  // 首先拿到最新的hook
  const hook = updateWorkInProgressHook();
  /**
   * hook结构 如下
   * {
   *  memoizedState: 状态,
   *  next: 指针，指向下一个hook对象
   * }
   */
  if (!currentlyRenderingFiber.alternate) {
    // 说明是第一次渲染
    hook.memoizedState = initialState; // 将初始化状态赋值给memoizedState
  }
  /**
   * 创建一个dispatch函数，用于更新状态
   * 参数：
   * 1. currentlyRenderingFiber: 当前正在渲染的fiber对象
   * 2. hook.queue: 存储Effect副作用钩子的数组
   */
  const dispatch = dispatchReducerAction.bind(
    null,
    currentlyRenderingFiber,
    hook,
    reducer
  );
  return [hook.memoizedState, dispatch];
}

/**
 *
 * @param {*} fiber 当前正在处理的fiber对象
 * @param {*} hook 当前正在处理的hook对象
 * @param {*} reducer 用户传入的改变状态的reducer函数，有可能不存在（useState没有传入reducer）
 * @param {*} action 如果没有那么就是使用的useState，传入的状态就是最终的状态
 * 处理最新的状态
 */
function dispatchReducerAction(fiber, hook, reducer, action) {
  // 得到最新的状态，如果存在reducer函数，则调用reducer函数，否则直接使用action
  hook.memoizedState = reducer ? reducer(hook.memoizedState, action) : action;
  // 状态更新完毕，该fiber就是旧的fiber，对其进行更新
  // 双缓冲
  fiber.alternate = { ...fiber };
  fiber.sibling = null; // 相邻的fiber节点设置为null，不更新相邻的节点
  // 根据当前的fiber进行更新
  scheduleUpdateOnFiber(fiber);
}
