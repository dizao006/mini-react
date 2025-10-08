import {
  FunctionComponent,
  ClassComponent,
  HostText,
  HostComponent,
  Fragment,
} from "./ReactWorkTags";
import { updateHostComponent } from "./ReactFiberReconciler";
/**
 * beginwork中根据fiber中的tag值执行不同的方法
 * @param {*} wip
 */
export function beginWork(wip) {
  const tag = wip.tag;
  switch (tag) {
    case FunctionComponent:
      return updateFunctionComponent(wip);
    case ClassComponent:
      return updateClassComponent(wip);
    case HostText:
      return updateHostText(wip);
    case HostComponent:
      return updateHostComponent(wip);
    case Fragment:
      return updateFragment(wip);
  }
}
