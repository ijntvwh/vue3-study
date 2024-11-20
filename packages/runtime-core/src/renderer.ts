import { ShapeFlags } from '@vue1/shared'
import { isSaveVnode } from './createVnode'

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
    const el = (vnode.el = hostCreateElement(type))
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
  const processElement = (n1, n2, container) => {
    if (n1 === null) {
      // 初始化操作
      mountElement(n2, container)
    } else {
      // 对比更新
      patchElement(n1, n2, container)
    }
  }
  const patchProps = (oldProps, newProps, el) => {
    if (newProps) {
      for (const key in newProps) {
        hostPatchProp(el, key, oldProps[key], newProps[key])
      }
    }
    if (oldProps) {
      for (const key in oldProps) {
        if (!(key in newProps)) {
          hostPatchProp(el, key, oldProps[key], null)
        }
      }
    }
  }
  const patchChildren = (n1, n2, container) => {
    debugger
  }
  const patchElement = (n1, n2, container) => {
    // 1 比较元素的差异,肯定需要复用dom元素
    const el = (n2.el = n1.el)
    // 2 比较属性和元素的子节点
    const oldProps = n1.props ?? {}
    const newProps = n2.props ?? {}
    // hostPatchProp只针对某一个属性来处理,class/style/event/attr
    patchProps(oldProps, newProps, el)
    patchChildren(n1, n2, el)
  }
  // 渲染走这里,更新也走这里
  const patch = (n1, n2, container) => {
    // 两次渲染同一个元素直接跳过
    if (n1 === n2) return
    if (n1 && !isSaveVnode(n1, n2)) {
      // 直接移除老的dom元素,初始化新的dom元素
      unmount(n1)
      n1 = null
    }
    // 对元素处理
    processElement(n1, n2, container)
  }
  const unmount = vnode => hostRemove(vnode.el)

  // 多次调用render 会进行虚拟节点的比较,再进行更新
  const render = (vnode, container) => {
    if (vnode === null) {
      // 要移除当前容器中的dom元素
      if (container._vnode) {
        unmount(container._vnode)
      }
    }
    patch(container._vnode ?? null, vnode, container)
    container._vnode = vnode
  }
  return {
    render,
  }
}
