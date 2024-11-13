import { isFunction } from '@vue1/shared'
import { ReactiveEffect } from './effect'
import { trackRefValue, triggerRefValue } from './ref'

class ComputedRefImpl {
  _value
  effect
  dep
  constructor(
    getter,
    public setter
  ) {
    // 我们需要创建一个effect 来管理当前计算属性的dirty属性
    this.effect = new ReactiveEffect(
      () => getter(this._value),
      () => {
        // 当计算属性依赖的值变化了, 我们应该触发渲染effect重新执行
        triggerRefValue(this)
      }
    )
  }
  get value() {
    // 这里我们需要做处理
    if (this.effect.dirty) {
      // 默认取值一定是脏的, 但是执行一次run后就不脏了
      this._value = this.effect.run()

      // 如果当前在外部effect中访问了计算属性,计算属性是可以收集这个effect的
      trackRefValue(this)
    }
    return this._value
  }
  set value(newVal) {
    this.setter(newVal)
  }
}

export function computed(getterOrOptions) {
  const onlyGetter = isFunction(getterOrOptions)
  let getter, setter
  if (onlyGetter) {
    getter = getterOrOptions
    setter = () => console.warn('computed value must be readonly')
  } else {
    getter = getterOrOptions.get
    setter = getterOrOptions.set
  }
  // 计算属性ref
  return new ComputedRefImpl(getter, setter)
}
