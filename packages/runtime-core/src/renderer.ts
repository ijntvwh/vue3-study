import { ShapeFlags } from "@vue1/shared"

export function createRenderer(renderOptions) {
  const {
    insert: hostInsert,
    remove: hostRemove,
    createElement: hostCreateElement,
    createText: hostCreateText,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    patchProp: hostPatchProp,
  } = renderOptions

  const mountChildren = (children, container) => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      // children[i] 可能是纯文本元素
      patch(null, child, container)
    }
  }
  const mountElement = (vnode, container) => {
    const { type, children, props, shapeFlag } = vnode
    const el = hostCreateElement(type)
    if (props) {
      for (const key in props) {
        hostPatchProp(el, key, null, props[key])
      }
    }
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      hostSetElementText(el, children)
    } else if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el)
    }

    hostInsert(el, container)
  }
  // 渲染走这里,更新也走这里
  const patch = (n1, n2, container) => {
    if (n1 === n2) return
    if (n1 === null) {
      mountElement(n2, container)
    } else {
      // 这里是更新
      console.log('更新')
    }
  }

  // 多次调用render 会进行虚拟节点的比较,再进行更新
  const render = (vnode, container) => {
    // console.log(vnode, container)
    // 将虚拟节点变成真实节点进行渲染
    patch(container._vnode ?? null, vnode, container)
    container._vnode = vnode
  }
  return {
    render,
  }
}
