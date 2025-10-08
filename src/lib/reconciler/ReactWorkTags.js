/**
 * 不同的fiber存在不同的tag
 */
export const FunctionComponent = 0; // 函数组件

export const ClassComponent = 1; // 类组件

export const IndeterminateComponent = 2; // 不确定的组件

export const HostRoot = 3; // 根节点

export const HostComponent = 5; // 原生节点

export const HostText = 6; // 文本节点

export const Fragment = 7; // 片段

export const ContextProvider = 8; // 上下文提供者
