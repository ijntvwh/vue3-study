export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, () => _effect.run())
  _effect.run()

  return _effect
}

export let activeEffect

function preCleanEffect(effect) {
  effect._depsLength = 0
  // 每次执行 id都是+1,如果当前同一个effect执行，id就是相同的
  effect._trackId++
}

function postCleanEffect(effect) {
  // deps数组的长度
  const len = effect.deps.length
  // 有效依赖的个数
  const n = effect._depsLength
  for (let i = n; i < len; i++) {
    // 删除映射表中对应的effect
    // 删除未依赖的 dep -> effect
    cleanDepEffect(effect.deps[i], effect)
  }
  // 更新依赖列表的长度
  effect.deps.length = n
}

class ReactiveEffect {
  // 用于记录当前effect执行了几次
  _trackId = 0
  deps = []
  _depsLength = 0

  public active = true

  // fn 用户编写的函数
  // 如何fn中依赖的数据发生变化后, 需要重新调用 -> run()
  constructor(
    public fn,
    public scheduler
  ) {}

  run() {
    // 让fn执行
    // 不是激活的,执行后, 什么都不用做
    if (!this.active) return this.fn()
    const lastEffect = activeEffect
    try {
      activeEffect = this

      // effect重新执行前,需要将上一次的依赖清空 effect.deps
      preCleanEffect(this)

      // 进行依赖收集 全局activeEffect  -> state.name state.age
      return this.fn()
    } finally {
      postCleanEffect(this)
      activeEffect = lastEffect
    }
  }

  stop() {
    // 后续来实现
    this.active = false
  }
}

function cleanDepEffect(dep, effect) {
  dep.delete(effect)
  // 如果map为空, 则删除这个属性
  if (dep.size === 0) dep.cleanup()
}

//双向记忆
// 1._trackId 用于记录执行次数(防止一个属性在当前effect中多次依赖收集) 只收集一次
// 2.拿到上一次依赖的最后一个和这次的比较
export function trackEffect(effect, dep) {
  
  // 需要重新的取收集依赖， 将不需要的移除掉
  if (dep.get(effect) !== effect._trackId) {
    // 更新id
    dep.set(effect, effect._trackId)

    const idx = effect._depsLength
    const oldDep = effect.deps[idx]
    if (oldDep !== dep) {
      // 删除 effect -> dep
      effect.deps[idx] = dep
      // 删除 dep -> effect
      if (oldDep) cleanDepEffect(oldDep, effect)
    }

    effect._depsLength++
  }
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler()
    }
  }
}
