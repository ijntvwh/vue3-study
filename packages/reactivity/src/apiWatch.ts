import { isObject } from '@vue1/shared'
import { ReactiveEffect } from './effect'

export function watch(source, cb, options = {} as any) {
  // watchEffect也是基于doWatch来实现的
  return doWatch(source, cb, options)
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
function doWatch(source, cb, { deep }) {
  // 产生一个可以给ReactiveEffect来使用的getter，需要对这个对象进行取值操作，会关联当前的reactiveEffect
  const getter = () => traverse(source, deep === false ? 1 : undefined)
  let oldValue

  const job = () => {
    const newValue = effect.run()
    cb(newValue, oldValue)
    oldValue = newValue
  }

  const effect = new ReactiveEffect(getter, job)
  oldValue = effect.run()
}
