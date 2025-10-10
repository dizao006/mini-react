function Component(props) {
  this.props = props;
}
// 类组件的表示，用于区分函数组件和类组件Component本身为一个函数，
// 所以需要将isReactComponent属性挂载到Component的原型上
// 如果不这么写会被当作函数组件
Component.prototype.isReactComponent = true;
const React = {
  Component,
};
export default React;
