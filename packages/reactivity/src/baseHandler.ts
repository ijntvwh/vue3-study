import { activeEffect } from './effect'
import { track } from './reactiveEffect'
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
    return Reflect.get(target, key, receiver)
  },
  set(target, key, value, receiver) {
    // 找到属性 让对应的effect重新执行
    // 触发更新 todo...
    return Reflect.set(target, key, value, receiver)
  },
}
