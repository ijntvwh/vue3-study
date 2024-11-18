import { nodeOps } from './nodeOps'
import patchProp from './patchProp'

import { createRenderer } from '@vue1/runtime-core'

export const renderOptions = Object.assign({ patchProp }, nodeOps)

export const render = (vnode, container) => {
  // render方法采用dom api来进行渲染
  return createRenderer(renderOptions).render(vnode, container)
}
export * from '@vue1/runtime-core'
