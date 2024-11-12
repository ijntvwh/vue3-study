import { activeEffect, trackEffect, triggerEffects } from './effect'

// 存放依赖收集的关系
const targetMap = new WeakMap()

export const createDep = (cleanup, key) => {
  // 创建的收集器还是一个map
  const dep = new Map() as any
  dep.cleanup = cleanup
  // 自定义的为了表示这个映射表是给哪个属性服务的
  dep.name = key
  return dep
}
export function track(target, key) {
  // activeEffect 有这个属性,说明这个key是在effect中访问的,没有说明是在effect之外访问的不用进行收集
  if (activeEffect) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
      targetMap.set(target, (depsMap = new Map()))
    }

    let dep = depsMap.get(key)
    if (!dep) {
      // cleanup 后面用于清理不需要的属性
      depsMap.set(key, (dep = createDep(() => depsMap.delete(key), key)))
    }

    // 将当前的effect放入dep(映射表)中, 后续可以根据值的变化触发此dep中存放的effect
    trackEffect(activeEffect, dep)

    console.log('targetMap', targetMap)
  }
}

export function trigger(target, key, newValue, oldValue) {
  const depsMap = targetMap.get(target)
  if (!depsMap) {
    // 找不到对象 直接return
    return
  }
  const dep = depsMap.get(key)
  if (dep) {
    triggerEffects(dep)
  }
}
