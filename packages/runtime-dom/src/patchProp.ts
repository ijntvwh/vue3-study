// 主要是对节点元素的属性操作 class style event 普通属性attr

import { pathClass } from './modules/patchClass'
import { patchEvent } from './modules/patchEvent'
import { patchStyle } from './modules/patchStyle'
import { patchAttr } from './modules/patchAttr'

// diff
export default function patchProp(el, key, prevValue, nextValue) {
  if (key === 'class') {
    return pathClass(el, nextValue)
  } else if (key === 'style') {
    return patchStyle(el, prevValue, nextValue)
  } else if (/^on[A-Z]/.test(key)) {
    // onClick
    return patchEvent(el, key, nextValue)
  } else {
    return patchAttr(el, key, nextValue)
  }
}
