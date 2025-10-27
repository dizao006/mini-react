import {
  FunctionComponent,
  ClassComponent,
  HostText,
  HostComponent,
  Fragment,
} from "./ReactWorkTags";
import {
  updateHostComponent,
  updateFunctionComponent,
  updateClassComponent,
  updateHostTextComponent,
  updateFragment,
} from "./ReactFiberReconciler";
/**
 * beginwork中根据fiber中的tag值执行不同的方法
 * @param {*} wip
 */
export function beginWork(wip) {
  const tag = wip.tag;
  switch (tag) {
    case FunctionComponent:
      console.log("函数组件");
      return updateFunctionComponent(wip);
    case ClassComponent:
      console.log("类组件");
      return updateClassComponent(wip);
    case HostText:
      console.log("文本节点");
      return updateHostTextComponent(wip);
    case HostComponent:
      console.log("原生节点");
      return updateHostComponent(wip);
    case Fragment:
      console.log("片段节点");
      return updateFragment(wip);
  }
}
