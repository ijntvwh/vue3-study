import { isObject } from '@vue1/shared'
import { mutableHandlers } from './baseHandler'
import { ReactiveFlags } from './constants'

const reactiveMap = new WeakMap()

// reactive shallowReactive

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

export function reactive(target) {
  return createReactiveObject(target)
}

export function toReactive(value) {
  return isObject(value) ? reactive(value) : value
}

export function isReactive(value){
 return !!value?.[ReactiveFlags.IS_REACTIVE]
}
