import { isObject } from '@vue1/shared'

const reactiveMap = new WeakMap()
enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}
const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) return true
    console.log('get', target, key, receiver)
    return target[key]
    // return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    console.log('set', target, key, value, receiver)
    return true
    // return Reflect.set(target, key, value, receiver)
  },
}
// reactive shallowReactive
export function reactive(target) {
  return createReactiveObject(target)
}
function createReactiveObject(target) {
  // 统一做判断，响应式的对象只能是对象
  if (!isObject(target)) return target

  // 如果有isReactive属性，说明已经是响应式的对象
  if (target[ReactiveFlags.IS_REACTIVE]) return target

  // 取缓存，如果有直接返回
  const existsProxy = reactiveMap.get(target)
  if (existsProxy) return existsProxy

  const proxy = new Proxy(target, mutableHandlers)
  reactiveMap.set(target, proxy)
  return proxy
}
