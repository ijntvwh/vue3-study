// 主要是对节点元素的增删改查

export const nodeOps = {
  insert(el, parent, anchor = null) {
    // https://developer.mozilla.org/zh-CN/docs/Web/API/Node/insertBefore
    // 如果 anchor 为 null，则节点将添加到列表的末尾
    parent.insertBefore(el, anchor)
  },
  remove(el) {
    const parent = el.parentNode
    parent?.removeChild(el)
  },
  createElement: tag => document.createElement(tag),
  createText: text => document.createTextNode(text),
  // 文本节点设置文本
  setText: (node, text) => (node.nodeValue = text),
  // dom元素设置文本
  setElementText: (el, text) => (el.textContent = text),
  parentNode: node => node.parentNode,
  nextSibling: node => node.nextSibling,
}
