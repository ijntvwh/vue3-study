export function effect(fn, options?) {
  const _effect = new ReactiveEffect(fn, () => _effect.run())
  _effect.run()

  return _effect
}

export let activeEffect
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
      // 进行依赖收集 全局activeEffect  -> state.name state.age
      return this.fn()
    } finally {
      activeEffect = lastEffect
    }
  }

  stop() {
    // 后续来实现
    this.active = false
  }
}

//双向记忆
export function trackEffect(effect, dep) {
  // dep -> effect
  dep.set(effect, effect._trackId)
  // effect -> dep
  effect.deps[effect._depsLength++] = dep
}

export function triggerEffects(dep) {
  for (const effect of dep.keys()) {
    if (effect.scheduler) {
      effect.scheduler()
    }
  }
}
