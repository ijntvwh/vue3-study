import { ShapeFlags } from '@vue1/shared'
import { isSameVnode } from './createVnode'

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
  const patchElement = (n1, n2) => {
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
    if (n1 && !isSameVnode(n1, n2)) {
      // 直接移除老的dom元素,初始化新的dom元素
      unmount(n1)
      n1 = null
    }
    // 对元素处理
    processElement(n1, n2, container)
  }
  const unmount = vnode => hostRemove(vnode.el)

  const processElement = (n1, n2, el) => {
    if (n1 === null) {
      // 初始化操作
      mountElement(n2, el)
    } else {
      // 对比更新
      patchElement(n1, n2)
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
  const unmountChildren = children => {
    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      unmount(child)
    }
  }
  const patchChildren = (n1, n2, el) => {
    // text array null
    const c1 = n1.children
    const c2 = n2.children
    const prevShapeFlag = n1.shapeFlag
    const shapeFlag = n2.shapeFlag
    // 1 新的是文本,老的是数组 移除老的
    // 2 新的是文本,老的也是文本 直接替换
    // 3 老的是数组,新的是数组 全量diff
    // 4 老的是数组,新的不是数组 移除老的子节点
    // 5 老的是文本,新的是空
    // 6 老的是文本,新的是数组

    // 新的是文本
    if (shapeFlag & ShapeFlags.TEXT_CHILDREN) {
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        unmountChildren(c1)
      }
      if (c1 !== c2) {
        hostSetElementText(el, c2)
      }
    } else {
      // 新的是数组或者空
      // 老的是数组
      if (prevShapeFlag & ShapeFlags.ARRAY_CHILDREN) {
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          // todo diff
        } else {
          // 新的是空
          unmountChildren(c1)
        }
      } else {
        // 老的是文本或者空
        if (prevShapeFlag & ShapeFlags.TEXT_CHILDREN) {
          hostSetElementText(el, '')
        }
        if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
          mountChildren(c2, el)
        }
      }
    }
  }

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
