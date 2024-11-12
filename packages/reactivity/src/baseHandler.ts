import { isObject } from '@vue1/shared'
import { track, trigger } from './reactiveEffect'
import { reactive } from './reactive'

export enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
}

// proxy 需要搭配 Reflect来使用
export const mutableHandlers: ProxyHandler<any> = {
  get(target, key, receiver) {
    if (key === ReactiveFlags.IS_REACTIVE) return true

    // 当取值的时候，应该让响应式属性 和 effect 映射起来
    // 依赖收集 todo...

    track(target, key)
    const res = Reflect.get(target, key, receiver)
    if (isObject(res)) {
      // 当取的值也是对象的时候,需要对这个对象进行代理,递归代理
      return reactive(res)
    }
    return res
  },
  set(target, key, value, receiver) {
    // 找到属性 让对应的effect重新执行
    // 触发更新 todo...
    const oldValue = target[key]
    const result = Reflect.set(target, key, value, receiver)
    if (oldValue !== value) {
      trigger(target, key, value, oldValue)
    }
    return result
  },
}
