function createInvoker(initialValue) {
  const invoker = e => invoker.value(e)
  invoker.value = initialValue
  return invoker
}

// 为了减少绑定与解绑的开销
export function patchEvent(el, name, nextValue) {
  // vei: vue event invoker
  const invokers = (el._vei ??= {})
  const eventName = name.slice(2).toLowerCase()
  const existInvoker = invokers[eventName]
  if (nextValue && existInvoker) {
    // 存在新的事件 并且 存在旧的事件
    return (existInvoker.value = nextValue)
  }
  if (nextValue) {
    // 存在新的事件 但是不存在旧的事件
    const invoker = (invokers[eventName] = createInvoker(nextValue))
    el.addEventListener(eventName, invoker)
  } else {
    // existInvoker
    // 不存在新的事件 但是存在旧的事件
    el.removeEventListener(eventName, existInvoker)
    invokers[eventName] = undefined
  }
}
