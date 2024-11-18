import { isFunction, isObject } from '@vue1/shared'
import { ReactiveEffect } from './effect'
import { isReactive } from './reactive'
import { isRef } from './ref'

export function watch(source, cb, options = {} as any) {
  // watchEffect也是基于doWatch来实现的
  return doWatch(source, cb, options)
}

export function watchEffect(source, cb, options = {} as any) {
  // 没有cb 就是watchEffect
  return doWatch(source, null, options)
}

// 控制depth 已经当前遍历到了哪一层
function traverse(source, depth, currentDepth = 0, seen = new Set()) {
  if (!isObject(source)) return source
  if (depth) {
    if (currentDepth >= depth) return source
    // 根据deep属性来看是否是深度
    currentDepth++
  }
  if (seen.has(source)) return source
  seen.add(source)
  for (const key in source) {
    // console.log('source', source, key)
    // 遍历就会触发每个属性的get
    traverse(source[key], depth, currentDepth, seen)
  }
  return source
}
function doWatch(source, cb, { deep, immediate }) {
  // 产生一个可以给ReactiveEffect来使用的getter，需要对这个对象进行取值操作，会关联当前的reactiveEffect
  const reactiveGetter = source1 => traverse(source1, deep === false ? 1 : undefined)
  let getter
  // console.log('source', source)
  if (isReactive(source)) {
    getter = () => reactiveGetter(source)
  } else if (isRef(source)) {
    getter = () => source.value
  } else if (isFunction(source)) {
    getter = source
  }

  let oldValue

  let clean
  const onCleanup = fn => {
    // console.log('registry clean')
    clean = () => {
      fn()
      clean = undefined
    }
  }
  const job = () => {
    if (cb) {
      // debugger
      const newValue = effect.run()

      // debugger
      // 在执行回调前，先调用上一次的清理操作进行清理
      clean?.()

      cb(newValue, oldValue, onCleanup)
      oldValue = newValue
    } else {
      effect.run()
    }
  }

  const effect = new ReactiveEffect(getter, job)

  if (cb) {
    if (immediate) {
      job()
    } else {
      oldValue = effect.run()
    }
  } else {
    // watchEffect 直接执行即可
    effect.run()
  }
  const unwatch = () => effect.stop()
  return unwatch
}
