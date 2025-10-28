// 最小堆实现

/**
 *
 * @param {*} heap
 * @returns 返回第一个任务
 */
export function peek(heap) {
  return heap.length === 0 ? null : heap[0];
}
/**
 * 将任务添加到堆中
 * @param {*} heap 堆
 * @param {*} node 任务
 * //推入后需要向上调整，保证最小堆的性质
 */
export function push(heap, node) {
  // 将当前任务推入
  heap.push(node);
  // 调整到合适的位置
  siftUp(heap, node, heap.length - 1);
}
/**
 * 向上调整
 * @param {*} heap 堆
 * @param {*} node 任务
 * @param {*} i 任务的索引
 */

function siftUp(heap, node, i) {
  let index = i;
  // 如果当前任务的过期时间小于父节点的过期时间，则需要向上调整
  while (index > 0) {
    // 拿到上一层然后进行比较
    const parentIndex = (index - 1) >> 1; //拿到父节点的索引
    const parent = heap[parentIndex]; //拿到父节点的任务
    if (compare(node, parent) < 0) {
      // 如果父节点的过期时间大于当前任务的过期时间，说明子节点过期时间更小，更紧急，则需要向上调整
      heap[parentIndex] = node; //将当前任务放到父节点的位置
      heap[index] = parent; //将父节点放到当前任务的位置
      index = parentIndex;
    } else {
      // 如果父节点的过期时间小于当前任务的过期时间，说明父节点过期时间更小，更紧急，则不需要调整
      return;
    }
  }
}

/**
 * 比较两个任务的过期时间
 * @param {*} a 任务a
 * @param {*} b 任务b
 * @returns 返回比较结果
 */
function compare(a, b) {
  // 每个任务都有sortIndex，过期时间
  const diff = a.sortIndex - b.sortIndex;
  // 如果通过过期时间比较不出来先后，则根据id来比较
  return diff !== 0 ? diff : a.id - b.id;
}
/**
 * // 删除队顶元素
 * @param {*} heap
 * @returns
 */
export function pop(heap) {
  // 说明队列为空
  if (heap.length === 0) return null;
  const first = heap[0]; //拿到对顶元素
  // 再取出队底任务
  const last = heap.pop();
  if (first !== last) {
    // 第一个任务不等于最后一个任务，任务队列不止一个
    heap[0] = last; //将队底任务放到队顶
    siftDown(heap, last, 0); //向下调整，放到合适的地方
  } else {
    //当前队列只有一个
    return first;
  }
}
/**
 * 向下调整
 * @param {*} heap 堆
 * @param {*} node 之前最后一个任务，但是现在放到了堆顶了
 * @param {*} i 该任务的索引
 */
function siftDown(heap, node, i) {
  let index = i; //记录下标
  let len = heap.length; //任务队列长度
  //获取当前任务队列的一半的下表
  const halfLen = len >> 1;
  while (index < halfLen) {
    // 因为为数组实现的二叉树，那么数组不允许越界
    // 因为二叉树，要么比较左树，要么比较右树
    // 先比较左树
    const leftIndex = index * 2 + 1; //左子节点的下标（二叉树性质）
    const left = heap[leftIndex]; //左子节点的任务
    // 再比较右树
    const rightIndex = leftIndex + 1; //右子节点的下标
    const right = heap[rightIndex]; //右子节点的任务
    // 比较左树和右树，谁更小
    if (compare(left, node) < 0) {
      // 说明左节点过期时间更紧急
      // 还需要进行左右节点比较，谁小谁上去
      // rightIndex < len 右节点可能存在缺失的情况，防止越界
      if (rightIndex < len && compare(right, left) < 0) {
        // 说明右节点过期时间更紧急
        heap[rightIndex] = node;
        heap[index] = right;
        index = rightIndex;
      } else {
        // 说明左节点更紧急
        heap[leftIndex] = node;
        heap[index] = left;
        index = leftIndex;
      }
    } else if (rightIndex < len && compare(right, node) < 0) {
      // 说明右节点过期时间更紧急，并且当前节点紧急程度大于左子树，所以不需要再对比左子树了
      heap[rightIndex] = node;
      heap[index] = right;
      index = rightIndex;
    } else {
      // 说明当前节点过期时间最紧急，不需要调整
      return;
    }
  }
}
