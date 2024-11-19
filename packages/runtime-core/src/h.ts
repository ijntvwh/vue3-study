import { isObject } from '@vue1/shared'
import { createVnode, isVnode } from './createVnode'

export function h(type, propsOrChildren?, children?) {
  const l = arguments.length
  if (l === 2) {
    if (isObject(propsOrChildren) && !Array.isArray(propsOrChildren)) {
      // 是vnode节点
      if (isVnode(propsOrChildren)) {
        return createVnode(type, null, [propsOrChildren])
      }
      // 是属性
      return createVnode(type, propsOrChildren)
    }
    // 儿子是数组 | 文本
    return createVnode(type, null, propsOrChildren)
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2)
    }
    if (l === 3 && isVnode(children)) {
      children = [children]
    }
    return createVnode(type, propsOrChildren, children)
  }
}
